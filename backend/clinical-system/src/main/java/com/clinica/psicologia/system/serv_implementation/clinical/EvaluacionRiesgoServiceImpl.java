package com.clinica.psicologia.system.serv_implementation.clinical;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.EvaluacionRiesgoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.EvaluacionRiesgoResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.EvaluacionRiesgoMapper;
import com.clinica.psicologia.system.model.catalog.NivelRiesgo;
import com.clinica.psicologia.system.model.catalog.TipoRiesgo;
import com.clinica.psicologia.system.model.clinical.EvaluacionRiesgo;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.patient.PacienteAsignacion;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.catalog.NivelRiesgoRepository;
import com.clinica.psicologia.system.repository.catalog.TipoRiesgoRepository;
import com.clinica.psicologia.system.repository.clinical.EvaluacionRiesgoRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.repository.patient.PacienteAsignacionRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.EvaluacionRiesgoService;
import com.clinica.psicologia.system.service.security.ClinicalAuthorizationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class EvaluacionRiesgoServiceImpl implements EvaluacionRiesgoService {

    private final EvaluacionRiesgoRepository repository;
    private final PacienteRepository pacienteRepository;
    private final SesionRepository sesionRepository;
    private final TipoRiesgoRepository tipoRiesgoRepository;
    private final NivelRiesgoRepository nivelRiesgoRepository;
    private final PacienteAsignacionRepository pacienteAsignacionRepository;
    private final EvaluacionRiesgoMapper mapper;
    private final ClinicalAuthorizationService authorizationService;

    @Override
    public EvaluacionRiesgoResponseDTO create(EvaluacionRiesgoRequestDTO dto) {

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Sesion sesion = sesionRepository.findById(dto.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        TipoRiesgo tipoRiesgo = tipoRiesgoRepository.findById(dto.getTipoRiesgoId())
                .orElseThrow(() -> new ResourceNotFoundException("Risk type not found"));

        NivelRiesgo nivelRiesgo = nivelRiesgoRepository.findById(dto.getNivelRiesgoId())
                .orElseThrow(() -> new ResourceNotFoundException("Risk level not found"));

        validateAssignedPsychologist(paciente);

        validatePatientConsistency(paciente, sesion);

        validateSessionOwner(sesion);

        validateEvaluationDate(dto.getFecha());

        if (repository.existsBySesionIdAndTipoRiesgoId(dto.getSesionId(),dto.getTipoRiesgoId())) {
            throw new BusinessRuleException("A risk evaluation for this risk type already exists in the selected session.");
        }

        EvaluacionRiesgo entity = new EvaluacionRiesgo();

        entity.setPaciente(paciente);
        entity.setSesion(sesion);
        entity.setTipoRiesgo(tipoRiesgo);
        entity.setNivelRiesgo(nivelRiesgo);

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<EvaluacionRiesgoResponseDTO> findAll() {
        return mapper.toResponseDTOList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public EvaluacionRiesgoResponseDTO findById(Integer id) {

        EvaluacionRiesgo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Risk evaluation not found"));

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<EvaluacionRiesgoResponseDTO> getByPaciente(Integer pacienteId) {
        return mapper.toResponseDTOList(repository.findByPacienteId(pacienteId));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<EvaluacionRiesgoResponseDTO> getBySesion(Integer sesionId) {
        return mapper.toResponseDTOList(repository.findBySesionId(sesionId));
    }

    @Override
    public EvaluacionRiesgoResponseDTO update(Integer id, EvaluacionRiesgoRequestDTO dto) {

        EvaluacionRiesgo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Risk evaluation not found"));

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Sesion sesion = sesionRepository.findById(dto.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        TipoRiesgo tipoRiesgo = tipoRiesgoRepository.findById(dto.getTipoRiesgoId())
                .orElseThrow(() -> new ResourceNotFoundException("Risk type not found"));

        NivelRiesgo nivelRiesgo = nivelRiesgoRepository.findById(dto.getNivelRiesgoId())
                .orElseThrow(() -> new ResourceNotFoundException("Risk level not found"));

        validateAssignedPsychologist(paciente);

        validatePatientConsistency(paciente, sesion);

        validateSessionOwner(sesion);

        validateEvaluationDate(dto.getFecha());

        if ((!entity.getSesion().getId().equals(dto.getSesionId())
                || !entity.getTipoRiesgo().getId().equals(dto.getTipoRiesgoId()))
                && repository.existsBySesionIdAndTipoRiesgoId(dto.getSesionId(), dto.getTipoRiesgoId())) {

            throw new BusinessRuleException("A risk evaluation for this risk type already exists in the selected session.");
        }

        entity.setPaciente(paciente);
        entity.setSesion(sesion);
        entity.setTipoRiesgo(tipoRiesgo);
        entity.setNivelRiesgo(nivelRiesgo);

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    public void delete(Integer id) {

        EvaluacionRiesgo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Risk evaluation not found"));

        validateAssignedPsychologist(entity.getPaciente());

        validateSessionOwner(entity.getSesion());

        repository.delete(entity);
    }

    private void validatePatientConsistency(Paciente paciente, Sesion sesion) {

        if (!sesion.getPaciente().getId().equals(paciente.getId())) {
            throw new BusinessRuleException("The session does not belong to the selected patient.");
        }
    }

    private void validateEvaluationDate(LocalDateTime fecha) {

        if (fecha.isAfter(LocalDateTime.now())) {
            throw new BusinessRuleException("Risk evaluation date cannot be in the future.");
        }
    }

    private void validateAssignedPsychologist(Paciente paciente) {

        PacienteAsignacion asignacion = pacienteAsignacionRepository
                .findFirstByPacienteIdAndFechaFinIsNull(paciente.getId())
                .orElseThrow(() -> new BusinessRuleException("The patient has no active psychologist assignment."));

        Usuario usuario = authorizationService.getAuthenticatedUser();

        if (!asignacion.getPsicologo().getId().equals(usuario.getId())) {
            throw new BusinessRuleException("Only the psychologist currently assigned to the patient may manage risk evaluations.");
        }
    }

    private void validateSessionOwner(Sesion sesion) {

        Usuario usuario = authorizationService.getAuthenticatedUser();

        if (!sesion.getUsuario().getId().equals(usuario.getId())) {
            throw new BusinessRuleException("Only the psychologist who conducted the session may manage its risk evaluations.");
        }
    }
}