package com.clinica.psicologia.system.serv_implementation.expert_system;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.expert_system.EvaluacionDiagnosticaRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.EvaluacionDiagnosticaResponseDTO;
import com.clinica.psicologia.system.mapper.expert_system.EvaluacionDiagnosticaMapper;
import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.expert_system.EvaluacionDiagnostica;
import com.clinica.psicologia.system.repository.catalog.DiagnosticoRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.repository.expert_system.EvaluacionDiagnosticaRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.expert_system.EvaluacionDiagnosticaService;
import com.clinica.psicologia.system.support_services.authorization.ClinicalAuthorizationService;
import com.clinica.psicologia.system.support_services.expert_system.InferenceEngineService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class EvaluacionDiagnosticaServiceImpl implements EvaluacionDiagnosticaService {

    private final EvaluacionDiagnosticaRepository repository;
    private final SesionRepository sessionRepository;
    private final DiagnosticoRepository diagnosisRepository;
    private final EvaluacionDiagnosticaMapper mapper;
    private final ClinicalAuthorizationService authorizationService;
    private final InferenceEngineService inferenceService;

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<EvaluacionDiagnosticaResponseDTO> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public EvaluacionDiagnosticaResponseDTO findById(Integer id) {
        EvaluacionDiagnostica entity = getEvaluation(id);
        authorize(entity.getSesion());
        return mapper.toResponse(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<EvaluacionDiagnosticaResponseDTO> findByPaciente(Integer pacienteId) {
        List<EvaluacionDiagnostica> evaluations = repository
                .findBySesionPacienteIdOrderByFechaHoraInferenciaDesc(pacienteId);
        evaluations.forEach(evaluation -> authorize(evaluation.getSesion()));
        return mapper.toResponseList(evaluations);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<EvaluacionDiagnosticaResponseDTO> findBySesion(Integer sesionId) {
        Sesion session = sessionRepository.findById(sesionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        authorize(session);
        return mapper.toResponseList(repository.findBySesionIdOrderByFechaHoraInferenciaDesc(sesionId));
    }

    @Override
    public EvaluacionDiagnosticaResponseDTO create(EvaluacionDiagnosticaRequestDTO request) {
        Sesion session = sessionRepository.findById(request.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        authorize(session);

        if (repository.existsBySesionId(request.getSesionId())) {
            throw new DuplicateResourceException("A diagnostic evaluation already exists for this session.");
        }

        inferenceService.inferirParaSesion(request.getSesionId(), request.getDiagnosticoSeleccionadoId());
        return mapper.toResponse(repository.findBySesionIdOrderByFechaHoraInferenciaDesc(request.getSesionId())
                .getFirst());
    }

    @Override
    public EvaluacionDiagnosticaResponseDTO update(Integer id, EvaluacionDiagnosticaRequestDTO request) {
        EvaluacionDiagnostica entity = getEvaluation(id);
        authorize(entity.getSesion());
        if (!entity.getSesion().getId().equals(request.getSesionId())) {
            throw new BusinessRuleException("A diagnostic evaluation cannot be moved to another session.");
        }

        Diagnostico selectedDiagnosis = request.getDiagnosticoSeleccionadoId() == null
                ? null
                : diagnosisRepository.findById(request.getDiagnosticoSeleccionadoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));
        entity.setDiagnosticoSeleccionado(selectedDiagnosis);
        entity.setConcordanciaDiagnostica(calculateConcordance(
                entity.getDiagnosticoSugerido(), selectedDiagnosis));
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public void delete(Integer id) {
        EvaluacionDiagnostica entity = getEvaluation(id);
        authorize(entity.getSesion());
        repository.delete(entity);
    }

    private EvaluacionDiagnostica getEvaluation(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic evaluation not found"));
    }

    private Integer calculateConcordance(Diagnostico suggested, Diagnostico selected) {
        if (suggested == null || selected == null) {
            return null;
        }
        return suggested.getId().equals(selected.getId()) ? 1 : 0;
    }

    private void authorize(Sesion session) {
        authorizationService.validateSessionOwner(session);
        authorizationService.validateAssignedPsychologist(session.getPaciente());
    }
}