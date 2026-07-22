package com.clinica.psicologia.system.serv_implementation.clinical;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.PruebaPsicologicaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.PruebaPsicologicaResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.PruebaPsicologicaMapper;
import com.clinica.psicologia.system.model.catalog.TipoPrueba;
import com.clinica.psicologia.system.model.clinical.PruebaPsicologica;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.catalog.TipoPruebaRepository;
import com.clinica.psicologia.system.repository.clinical.PruebaPsicologicaRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.PruebaPsicologicaService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;
import com.clinica.psicologia.system.support_services.authorization.ClinicalAuthorizationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PruebaPsicologicaServiceImpl implements PruebaPsicologicaService {

    private final PruebaPsicologicaRepository repository;
    private final PacienteRepository pacienteRepository;
    private final SesionRepository sesionRepository;
    private final TipoPruebaRepository tipoPruebaRepository;
    private final PruebaPsicologicaMapper mapper;
    private final ClinicalAuthorizationService authorizationService;
    private final ApplicationSupportService common;

    @Override
    public PruebaPsicologicaResponseDTO create(PruebaPsicologicaRequestDTO dto) {

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        TipoPrueba tipoPrueba = tipoPruebaRepository.findById(dto.getTipoPruebaId())
                .orElseThrow(() -> new ResourceNotFoundException("Test type not found"));

        authorizationService.validateAssignedPsychologist(paciente);

        Sesion sesion = null;

        if (dto.getSesionId() != null) {

            sesion = sesionRepository.findById(dto.getSesionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

            validatePatientConsistency(paciente, sesion);
            validateSessionOwner(sesion);
        }

        validateApplicationDate(dto.getFechaAplicacion());

        if (dto.getFechaAplicacion() != null &&
                repository.existsByPacienteIdAndTipoPruebaIdAndFechaAplicacion(
                        dto.getPacienteId(),
                        dto.getTipoPruebaId(),
                        dto.getFechaAplicacion())) {

            throw new BusinessRuleException("This patient already has this psychological test registered for the selected date.");
        }

        PruebaPsicologica entity = new PruebaPsicologica();

        entity.setPaciente(paciente);
        entity.setSesion(sesion);
        entity.setTipoPrueba(tipoPrueba);
        entity.setEstado(common.getActiveState());

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PruebaPsicologicaResponseDTO> findAll() {
        return mapper.toResponseDTOList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public PruebaPsicologicaResponseDTO findById(Integer id) {

        PruebaPsicologica entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Psychological test not found"));

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PruebaPsicologicaResponseDTO> getByPaciente(Integer pacienteId) {
        return mapper.toResponseDTOList(repository.findByPacienteIdOrderByFechaAplicacionDescIdDesc(pacienteId));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PruebaPsicologicaResponseDTO> getBySesion(Integer sesionId) {
        return mapper.toResponseDTOList(repository.findBySesionId(sesionId));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PruebaPsicologicaResponseDTO> getByTipoPrueba(Integer tipoPruebaId) {
        return mapper.toResponseDTOList(repository.findByTipoPruebaId(tipoPruebaId));
    }

    @Override
    public PruebaPsicologicaResponseDTO update(Integer id,PruebaPsicologicaRequestDTO dto) {

        PruebaPsicologica entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Psychological test not found"));

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        TipoPrueba tipoPrueba = tipoPruebaRepository.findById(dto.getTipoPruebaId())
                .orElseThrow(() -> new ResourceNotFoundException("Test type not found"));

        authorizationService.validateAssignedPsychologist(paciente);

        Sesion sesion = null;

        if (dto.getSesionId() != null) {

            sesion = sesionRepository.findById(dto.getSesionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

            validatePatientConsistency(paciente, sesion);
            validateSessionOwner(sesion);
        }

        validateApplicationDate(dto.getFechaAplicacion());

        boolean duplicate =
                (!entity.getPaciente().getId().equals(dto.getPacienteId())
                        || !entity.getTipoPrueba().getId().equals(dto.getTipoPruebaId())
                        || !Objects.equals(entity.getFechaAplicacion(), dto.getFechaAplicacion()))
                        &&
                        dto.getFechaAplicacion() != null &&
                        repository.existsByPacienteIdAndTipoPruebaIdAndFechaAplicacion(
                                dto.getPacienteId(),
                                dto.getTipoPruebaId(),
                                dto.getFechaAplicacion());

        if (duplicate) {
            throw new BusinessRuleException("This patient already has this psychological test registered for the selected date.");
        }

        entity.setPaciente(paciente);
        entity.setSesion(sesion);
        entity.setTipoPrueba(tipoPrueba);

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    public void delete(Integer id) {

        PruebaPsicologica entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Psychological test not found"));

        authorizationService.validateAssignedPsychologist(entity.getPaciente());

        if (entity.getSesion() != null) {
            validateSessionOwner(entity.getSesion());
        }

        repository.delete(entity);
    }

    private void validatePatientConsistency(Paciente paciente,Sesion sesion) {
        if (!sesion.getPaciente().getId().equals(paciente.getId())) {
            throw new BusinessRuleException("The session does not belong to the selected patient.");
        }
    }

    private void validateApplicationDate(LocalDate fecha) {

        if (fecha != null && fecha.isAfter(LocalDate.now())) {
            throw new BusinessRuleException("Application date cannot be in the future.");
        }
    }

    private void validateSessionOwner(Sesion sesion) {

        Usuario usuario = authorizationService.getAuthenticatedUser();

        if (!sesion.getUsuario().getId().equals(usuario.getId())) {
            throw new BusinessRuleException("Only the psychologist who conducted the session may manage its psychological tests.");
        }
    }
}