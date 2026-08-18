package com.clinica.psicologia.system.serv_implementation.clinical;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.AplicacionPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.AplicacionPruebaResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.AplicacionMapper;
import com.clinica.psicologia.system.model.catalog.PruebaPsicologica;
import com.clinica.psicologia.system.model.clinical.AplicacionPrueba;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.catalog.PruebaPsicologicaRepository;
import com.clinica.psicologia.system.repository.clinical.AplicacionPruebaRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.AplicacionPruebaService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;
import com.clinica.psicologia.system.support_services.authorization.ClinicalAuthorizationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AplicacionPruebaServiceImpl implements AplicacionPruebaService {

    private final AplicacionPruebaRepository repository;
    private final SesionRepository sesionRepository;
    private final PruebaPsicologicaRepository pruebaPsicologicaRepository;
    private final AplicacionMapper mapper;
    private final ClinicalAuthorizationService authorizationService;
    private final ApplicationSupportService common;

    @Override
    public AplicacionPruebaResponseDTO create(AplicacionPruebaRequestDTO dto) {

        Sesion sesion = sesionRepository.findById(dto.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        PruebaPsicologica pruebaPsicologica = pruebaPsicologicaRepository.findById(dto.getPruebaPsicologicaId())
                .orElseThrow(() -> new ResourceNotFoundException("Psychological test not found"));

        validateAuthorization(sesion);

        validateApplicationDate(dto.getFechaAplicacion(), sesion);

        AplicacionPrueba entity = new AplicacionPrueba();

        entity.setSesion(sesion);
        entity.setPruebaPsicologica(pruebaPsicologica);
        entity.setFechaAplicacion(dto.getFechaAplicacion());
        entity.setEstado(common.getActiveState());

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<AplicacionPruebaResponseDTO> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public AplicacionPruebaResponseDTO findById(Integer id) {
        AplicacionPrueba entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test application not found"));
        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<AplicacionPruebaResponseDTO> getBySesion(Integer sesionId) {

        if (!sesionRepository.existsById(sesionId)) {
            throw new ResourceNotFoundException("Session not found");
        }

        return mapper.toResponseList(repository.findBySesionIdOrderByFechaAplicacionDescIdDesc(sesionId));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<AplicacionPruebaResponseDTO> getByPruebaPsicologica(Integer pruebaPsicologicaId) {
        if (!pruebaPsicologicaRepository.existsById(pruebaPsicologicaId)) {
            throw new ResourceNotFoundException("Psychological test not found");
        }
        return mapper.toResponseList(
                repository.findByPruebaPsicologicaIdOrderByFechaAplicacionDescIdDesc(pruebaPsicologicaId));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<AplicacionPruebaResponseDTO> getBySesionAndPrueba(Integer sesionId, Integer pruebaPsicologicaId) {
        if (!sesionRepository.existsById(sesionId)) {
            throw new ResourceNotFoundException("Session not found");
        }
        if (!pruebaPsicologicaRepository.existsById(pruebaPsicologicaId)) {
            throw new ResourceNotFoundException("Psychological test not found");
        }
        return mapper.toResponseList(repository
                .findBySesionIdAndPruebaPsicologicaIdOrderByFechaAplicacionDescIdDesc(sesionId, pruebaPsicologicaId));
    }

    @Override
    public AplicacionPruebaResponseDTO update(Integer id, AplicacionPruebaRequestDTO dto) {
        AplicacionPrueba entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test application not found"));

        Sesion sesion = sesionRepository.findById(dto.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        PruebaPsicologica pruebaPsicologica = pruebaPsicologicaRepository.findById(dto.getPruebaPsicologicaId())
                .orElseThrow(() -> new ResourceNotFoundException("Psychological test not found"));

        validateAuthorization(sesion);

        validateApplicationDate(dto.getFechaAplicacion(), sesion);

        entity.setSesion(sesion);
        entity.setPruebaPsicologica(pruebaPsicologica);
        entity.setFechaAplicacion(dto.getFechaAplicacion());

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    public void delete(Integer id) {
        AplicacionPrueba entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test application not found"));
        validateAuthorization(entity.getSesion());
        repository.delete(entity);
    }

    private void validateAuthorization(Sesion sesion) {
        Paciente paciente = sesion.getPaciente();
        authorizationService.validateAssignedPsychologist(paciente);
        Usuario usuario = authorizationService.getAuthenticatedUser();

        if (!sesion.getUsuario().getId().equals(usuario.getId())) {
            throw new BusinessRuleException(
                    "Only the psychologist who conducted the session may manage its psychological test applications.");
        }
    }

    private void validateApplicationDate(LocalDate fechaAplicacion, Sesion sesion) {
        LocalDate today = LocalDate.now();

        if (fechaAplicacion.isAfter(today)) {
            throw new BusinessRuleException("Application date cannot be in the future.");
        }

        LocalDate sessionDate = sesion.getFechaSesion().toLocalDate();

        if (fechaAplicacion.isBefore(sessionDate)) {
            throw new BusinessRuleException("Application date cannot be before the session date.");
        }
    }
}