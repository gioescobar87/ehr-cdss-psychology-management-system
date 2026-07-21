package com.clinica.psicologia.system.serv_implementation.clinical;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.SeguimientoObjetivoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.SeguimientoObjetivoResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.SeguimientoObjetivoMapper;
import com.clinica.psicologia.system.model.clinical.ObjetivoTerapia;
import com.clinica.psicologia.system.model.clinical.SeguimientoObjetivo;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.patient.PacienteAsignacion;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.clinical.ObjetivoTerapiaRepository;
import com.clinica.psicologia.system.repository.clinical.SeguimientoObjetivoRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.repository.patient.PacienteAsignacionRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.security.model.SecurityUser;
import com.clinica.psicologia.system.service.clinical.SeguimientoObjetivoService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SeguimientoObjetivoServiceImpl implements SeguimientoObjetivoService {

    private final SeguimientoObjetivoRepository repository;
    private final ObjetivoTerapiaRepository objetivoRepository;
    private final SesionRepository sesionRepository;
    private final SeguimientoObjetivoMapper mapper;
    private final PacienteAsignacionRepository pacienteAsignacionRepository;

    @Override
    public SeguimientoObjetivoResponseDTO create(SeguimientoObjetivoRequestDTO dto) {

        ObjetivoTerapia objetivo = objetivoRepository.findById(dto.getObjetivoTerapiaId())
                .orElseThrow(() -> new ResourceNotFoundException("Therapy objective not found"));

        Sesion sesion = sesionRepository.findById(dto.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        validatePatientConsistency(objetivo, sesion);

        validateAssignedPsychologist(
                objetivo.getPlanTratamiento()
                        .getPacienteDiagnostico()
                        .getPaciente());

        SeguimientoObjetivo entity = new SeguimientoObjetivo();

        entity.setObjetivoTerapia(objetivo);
        entity.setSesion(sesion);

        mapper.updateEntity(entity, dto);

        validateSessionDate(objetivo, sesion);

        if (objetivo.getFechaMeta() != null
                && sesion.getFechaSesion().isAfter(objetivo.getFechaMeta().atTime(23, 59, 59))) {

            throw new BusinessRuleException("La sesión ocurrió después de la fecha meta del objetivo terapéutico.");
        }

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<SeguimientoObjetivoResponseDTO> findAll() {
        return mapper.toResponseDTOList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public SeguimientoObjetivoResponseDTO findById(Integer id) {
        SeguimientoObjetivo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Progress record not found"));

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<SeguimientoObjetivoResponseDTO> getByObjetivoTerapia(Integer objetivoTerapiaId) {
        return mapper.toResponseDTOList(repository.findByObjetivoTerapiaId(objetivoTerapiaId));
    }

    @Override
    public SeguimientoObjetivoResponseDTO update(Integer id, SeguimientoObjetivoRequestDTO dto) {

        SeguimientoObjetivo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Progress record not found"));

        ObjetivoTerapia objetivo = objetivoRepository.findById(dto.getObjetivoTerapiaId())
                .orElseThrow(() -> new ResourceNotFoundException("Therapy objective not found"));

        Sesion sesion = sesionRepository.findById(dto.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        validateAssignedPsychologist(
                entity.getObjetivoTerapia()
                        .getPlanTratamiento()
                        .getPacienteDiagnostico()
                        .getPaciente());

        validatePatientConsistency(objetivo, sesion);

        entity.setObjetivoTerapia(objetivo);
        entity.setSesion(sesion);

        mapper.updateEntity(entity, dto);

        validateSessionDate(objetivo, sesion);

        if (objetivo.getFechaMeta() != null
                && sesion.getFechaSesion().isAfter(objetivo.getFechaMeta().atTime(23, 59, 59))) {

            throw new BusinessRuleException("La sesión ocurrió después de la fecha meta del objetivo terapéutico.");
        }

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    public void delete(Integer id) {

        SeguimientoObjetivo entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Progress record not found"));

        validateAssignedPsychologist(
                entity.getObjetivoTerapia()
                        .getPlanTratamiento()
                        .getPacienteDiagnostico()
                        .getPaciente());

        repository.delete(entity);
    }

    private void validatePatientConsistency(ObjetivoTerapia objetivo, Sesion sesion) {

        Integer pacienteObjetivo = objetivo.getPlanTratamiento().getPacienteDiagnostico().getPaciente().getId();

        Integer pacienteSesion = sesion.getPaciente().getId();

        if (!pacienteObjetivo.equals(pacienteSesion)) {
            throw new BusinessRuleException("The session does not belong to the same patient as the treatment plan.");
        }
    }

    private Usuario getAuthenticatedUser() {
        SecurityUser securityUser = (SecurityUser) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return securityUser.getUsuario();
    }

    private void validateAssignedPsychologist(Paciente paciente) {

        PacienteAsignacion asignacion = pacienteAsignacionRepository
                .findFirstByPacienteIdAndFechaFinIsNull(paciente.getId())
                .orElseThrow(() -> new BusinessRuleException("The patient has no active psychologist assignment."));

        Usuario usuario = getAuthenticatedUser();
        
        if (!asignacion.getPsicologo().getId().equals(usuario.getId())) {
            throw new BusinessRuleException(
                    "Only the psychologist currently assigned to the patient may manage treatment follow-ups.");
        }
    }

    private void validateSessionDate(ObjetivoTerapia objetivo, Sesion sesion) {
        if (sesion.getFechaSesion().isBefore(objetivo.getFechaInicio().atStartOfDay())) {
            throw new BusinessRuleException("La sesión ocurrió antes del inicio del objetivo terapéutico.");
        }

        if (objetivo.getFechaMeta() != null
                && sesion.getFechaSesion().isAfter(objetivo.getFechaMeta().atTime(23, 59, 59))) {
            throw new BusinessRuleException("La sesión ocurrió después de la fecha meta del objetivo terapéutico.");
        }
    }

}