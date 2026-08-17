package com.clinica.psicologia.system.serv_implementation.catalog;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.SustanciaAlergenaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.SustanciaAlergenaResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.SustanciaAlergenaMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.catalog.SustanciaAlergena;
import com.clinica.psicologia.system.model.catalog.TipoSustanciaAlergena;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.SustanciaAlergenaRepository;
import com.clinica.psicologia.system.repository.catalog.TipoSustanciaAlergenaRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.catalog.SustanciaAlergenaService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SustanciaAlergenaServiceImpl
        implements SustanciaAlergenaService {

    private final SustanciaAlergenaRepository repository;
    private final TipoSustanciaAlergenaRepository tipoRepository;
    private final EstadoRepository estadoRepository;
    private final SustanciaAlergenaMapper mapper;
    private final ApplicationSupportService supportService;

    private static final String DUPLICATE_MESSAGE =
            "Allergenic substance already exists";

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<SustanciaAlergenaResponseDTO> findAll() {

        return mapper.toResponseList(
                repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public SustanciaAlergenaResponseDTO findById(
            Integer id) {

        SustanciaAlergena entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Allergenic substance not found"));

        return mapper.toResponse(entity);
    }

    @Override
    public SustanciaAlergenaResponseDTO create(
            SustanciaAlergenaRequestDTO request) {

        if (repository.existsByNombre(
                request.getNombre())) {

            throw new DuplicateResourceException(
                    DUPLICATE_MESSAGE);
        }

        TipoSustanciaAlergena tipo =
                tipoRepository.findById(
                        request.getTipoSustanciaAlergenaId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Allergenic substance type not found"));

        Estado estado = supportService.getActiveState();

        SustanciaAlergena entity =
                new SustanciaAlergena();

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
        entity.setTipoSustanciaAlergena(tipo);
        entity.setEstado(estado);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public SustanciaAlergenaResponseDTO update(
            Integer id,
            SustanciaAlergenaRequestDTO request) {

        SustanciaAlergena entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Allergenic substance not found"));

        if (repository.existsByNombreAndIdNot(
                request.getNombre(),
                id)) {

            throw new DuplicateResourceException(
                    DUPLICATE_MESSAGE);
        }

        TipoSustanciaAlergena tipo =
                tipoRepository.findById(
                        request.getTipoSustanciaAlergenaId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Allergenic substance type not found"));

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
        entity.setTipoSustanciaAlergena(tipo);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public void changeStatus(
            Integer id,
            Integer estadoId) {

        SustanciaAlergena entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Allergenic substance not found"));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "State not found"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    public void delete(Integer id) {

        SustanciaAlergena entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Allergenic substance not found"));

        repository.delete(entity);
    }
}