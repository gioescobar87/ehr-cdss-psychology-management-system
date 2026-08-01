package com.clinica.psicologia.system.serv_implementation.expert_system;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.expert_system.EvaluacionDiagnosticaRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.EvaluacionDiagnosticaResponseDTO;
import com.clinica.psicologia.system.mapper.expert_system.EvaluacionDiagnosticaMapper;
import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.expert_system.ArbolDiagnostico;
import com.clinica.psicologia.system.model.expert_system.EvaluacionDiagnostica;
import com.clinica.psicologia.system.repository.catalog.DiagnosticoRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.repository.expert_system.ArbolDiagnosticoRepository;
import com.clinica.psicologia.system.repository.expert_system.EvaluacionDiagnosticaRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.expert_system.EvaluacionDiagnosticaService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;
import com.clinica.psicologia.system.support_services.authorization.ClinicalAuthorizationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class EvaluacionDiagnosticaServiceImpl implements EvaluacionDiagnosticaService {

    private final EvaluacionDiagnosticaRepository repository;
    private final SesionRepository sesionRepository;
    private final DiagnosticoRepository diagnosticoRepository;
    private final ArbolDiagnosticoRepository arbolRepository;
    private final EstadoRepository estadoRepository;
    private final EvaluacionDiagnosticaMapper mapper;
    private final ClinicalAuthorizationService authorizationService;
    private final ApplicationSupportService applicationSupportService;

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<EvaluacionDiagnosticaResponseDTO> findAll() {

        return mapper.toResponseList(
                repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public EvaluacionDiagnosticaResponseDTO findById(
            Integer id) {

        EvaluacionDiagnostica entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic evaluation not found"));

        authorizationService.validateSessionOwner(
                entity.getSesion());

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<EvaluacionDiagnosticaResponseDTO> findByPaciente(
            Integer pacienteId) {

        List<EvaluacionDiagnostica> entities = repository.findBySesionPacienteIdOrderByFechaEvaluacionDesc(
                pacienteId);

        if (!entities.isEmpty()) {

            authorizationService.validateAssignedPsychologist(
                    entities.getFirst().getSesion().getPaciente());
        }

        return mapper.toResponseList(
                entities);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<EvaluacionDiagnosticaResponseDTO> findBySesion(
            Integer sesionId) {

        Sesion sesion = sesionRepository.findById(sesionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Session not found"));

        authorizationService.validateSessionOwner(
                sesion);

        return mapper.toResponseList(
                repository.findBySesionIdOrderByFechaEvaluacionDesc(
                        sesionId));
    }

    @Override
    public EvaluacionDiagnosticaResponseDTO create(
            EvaluacionDiagnosticaRequestDTO request) {

        Sesion sesion = sesionRepository.findById(
                request.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Session not found"));

        if (repository.existsBySesionId(request.getSesionId())) {
            throw new DuplicateResourceException("A diagnostic evaluation already exists for this session.");
        }

        authorizationService.validateSessionOwner(sesion);

        authorizationService.validateAssignedPsychologist(sesion.getPaciente());

        Diagnostico diagnosticoFinal = diagnosticoRepository.findById(
                request.getDiagnosticoFinalId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Diagnosis not found"));

        ArbolDiagnostico arbol = resolveDiagnosticTree(diagnosticoFinal);

        Estado estado = estadoRepository.findById(
                request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "State not found"));

        EvaluacionDiagnostica entity = new EvaluacionDiagnostica();

        entity.setSesion(sesion);
        entity.setUsuario(
                authorizationService.getAuthenticatedUser());

        entity.setDiagnosticoFinal(
                diagnosticoFinal);

        entity.setArbolDiagnostico(
                arbol);

        entity.setVersionArbol(
                arbol.getVersion());

        resetInference(entity);

        entity.setFechaEvaluacion(LocalDateTime.now());
        entity.setEstado(
                estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public EvaluacionDiagnosticaResponseDTO update(
            Integer id,
            EvaluacionDiagnosticaRequestDTO request) {

        EvaluacionDiagnostica entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Diagnostic evaluation not found"));

        authorizationService.validateSessionOwner(
                entity.getSesion());

        Diagnostico diagnosticoFinal = diagnosticoRepository.findById(
                request.getDiagnosticoFinalId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Diagnosis not found"));

        Estado estado = estadoRepository.findById(
                request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "State not found"));

        boolean diagnosticoChanged = !entity.getDiagnosticoFinal().getId()
                .equals(diagnosticoFinal.getId());

        if (diagnosticoChanged) {

            ArbolDiagnostico arbol = resolveDiagnosticTree(diagnosticoFinal);

            entity.setDiagnosticoFinal(
                    diagnosticoFinal);

            entity.setArbolDiagnostico(
                    arbol);

            entity.setVersionArbol(
                    arbol.getVersion());

            /*
             * Previous inference is no longer valid.
             */

            resetInference(entity);

        }

        entity.setEstado(
                estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public void changeStatus(
            Integer id,
            Integer estadoId) {

        EvaluacionDiagnostica entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Diagnostic evaluation not found"));

        authorizationService.validateSessionOwner(
                entity.getSesion());

        Estado estado = estadoRepository.findById(
                estadoId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "State not found"));

        entity.setEstado(
                estado);

        repository.save(entity);
    }

    @Override
    public void delete(Integer id) {

        EvaluacionDiagnostica entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Diagnostic evaluation not found"));

        authorizationService.validateSessionOwner(
                entity.getSesion());

        repository.delete(entity);
    }

    private ArbolDiagnostico resolveDiagnosticTree(Diagnostico diagnostico) {

        return arbolRepository
                .findFirstByCategoriaDiagnosticaIdAndEstadoNombreOrderByVersionDesc(
                        diagnostico.getCategoriaDiagnostica().getId(),
                        applicationSupportService.getActiveState().getNombre())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No active diagnostic tree exists for the selected diagnosis."));
    }

    private void resetInference(EvaluacionDiagnostica entity) {

        entity.setDiagnosticoSugerido(null);
        entity.setDiagnosticoConfirmado(false);
        entity.setObservacionesSistema(null);
        entity.setFechaInferencia(null);
        entity.setTiempoInferenciaMs(null);
    }
}