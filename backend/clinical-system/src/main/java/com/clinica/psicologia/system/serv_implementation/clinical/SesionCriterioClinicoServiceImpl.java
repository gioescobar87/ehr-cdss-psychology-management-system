package com.clinica.psicologia.system.serv_implementation.clinical;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.SesionCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.request.clinical.SesionCriterioClinicoBatchRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionCriterioClinicoResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.SesionCriterioClinicoMapper;
import com.clinica.psicologia.system.model.catalog.CriterioClinico;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.clinical.SesionCriterioClinico;
import com.clinica.psicologia.system.repository.catalog.CriterioClinicoRepository;
import com.clinica.psicologia.system.repository.clinical.SesionCriterioClinicoRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.SesionCriterioClinicoService;
import com.clinica.psicologia.system.support_services.authorization.ClinicalAuthorizationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SesionCriterioClinicoServiceImpl implements SesionCriterioClinicoService {

    private final SesionCriterioClinicoRepository repository;
    private final SesionRepository sesionRepository;
    private final CriterioClinicoRepository criterioRepository;
    private final SesionCriterioClinicoMapper mapper;
    private final ClinicalAuthorizationService authorizationService;

    @Override
    public SesionCriterioClinicoResponseDTO create(SesionCriterioClinicoRequestDTO request) {
        if (repository.existsBySesionIdAndCriterioClinicoId(
                request.getSesionId(), request.getCriterioClinicoId())) {
            throw new DuplicateResourceException("El criterio clínico ya fue registrado en la sesión.");
        }

        Sesion sesion = getAuthorizedSession(request.getSesionId());
        CriterioClinico criterio = getCriterio(request.getCriterioClinicoId());

        SesionCriterioClinico entity = new SesionCriterioClinico();
        entity.setSesion(sesion);
        entity.setCriterioClinico(criterio);
        mapper.updateEntity(entity, request);

        return mapper.toResponseDTO(repository.save(entity));
    }

    @Override
    public List<SesionCriterioClinicoResponseDTO> createBatch(SesionCriterioClinicoBatchRequestDTO request) {
        Sesion sesion = getAuthorizedSession(request.getSesionId());
        Set<Integer> uniqueCriterionIds = new HashSet<>(request.getCriterioClinicoIds());

        if (uniqueCriterionIds.size() != request.getCriterioClinicoIds().size()) {
            throw new DuplicateResourceException("La selección contiene criterios clínicos duplicados.");
        }

        List<CriterioClinico> criteria = uniqueCriterionIds.stream()
                .map(this::getCriterio)
                .toList();

        List<SesionCriterioClinico> entities = criteria.stream()
                .map(criterio -> repository
                        .findBySesionIdAndCriterioClinicoId(sesion.getId(), criterio.getId())
                        .map(entity -> {
                            if (Boolean.TRUE.equals(entity.getPresente())) {
                                throw new DuplicateResourceException("Uno de los criterios clínicos ya está presente en la sesión.");
                            }
                            entity.setPresente(true);
                            return entity;
                        })
                        .orElseGet(() -> {
                            SesionCriterioClinico entity = new SesionCriterioClinico();
                            entity.setSesion(sesion);
                            entity.setCriterioClinico(criterio);
                            entity.setPresente(true);
                            return entity;
                        }))
                .toList();

        return mapper.toResponseDTOList(repository.saveAll(entities));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<SesionCriterioClinicoResponseDTO> findAll() {
        return mapper.toResponseDTOList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public SesionCriterioClinicoResponseDTO findById(Integer id) {
        SesionCriterioClinico entity = getEntity(id);
        getAuthorizedSession(entity.getSesion().getId());
        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<SesionCriterioClinicoResponseDTO> getBySesion(Integer sesionId) {
        getAuthorizedSession(sesionId);
        return mapper.toResponseDTOList(repository.findBySesionIdOrderByIdAsc(sesionId));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<SesionCriterioClinicoResponseDTO> getByPaciente(Integer pacienteId) {
        return mapper.toResponseDTOList(repository.findBySesionPacienteIdOrderByIdAsc(pacienteId));
    }

    @Override
    public SesionCriterioClinicoResponseDTO update(Integer id, SesionCriterioClinicoRequestDTO request) {
        SesionCriterioClinico entity = getEntity(id);
        getAuthorizedSession(entity.getSesion().getId());

        if ((!entity.getSesion().getId().equals(request.getSesionId())
                || !entity.getCriterioClinico().getId().equals(request.getCriterioClinicoId()))
                && repository.existsBySesionIdAndCriterioClinicoId(
                        request.getSesionId(), request.getCriterioClinicoId())) {
            throw new DuplicateResourceException("El criterio clínico ya fue registrado en la sesión.");
        }

        entity.setSesion(getAuthorizedSession(request.getSesionId()));
        entity.setCriterioClinico(getCriterio(request.getCriterioClinicoId()));
        mapper.updateEntity(entity, request);

        return mapper.toResponseDTO(repository.save(entity));
    }

    @Override
    public void delete(Integer id) {
        SesionCriterioClinico entity = getEntity(id);
        getAuthorizedSession(entity.getSesion().getId());
        repository.delete(entity);
    }

    private SesionCriterioClinico getEntity(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Criterio clínico de sesión no encontrado."));
    }

    private Sesion getAuthorizedSession(Integer id) {
        Sesion sesion = sesionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada."));
        authorizationService.validateSessionOwner(sesion);
        authorizationService.validateAssignedPsychologist(sesion.getPaciente());
        return sesion;
    }

    private CriterioClinico getCriterio(Integer id) {
        return criterioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Criterio clínico no encontrado."));
    }
}