package com.clinica.psicologia.system.service.catalog.impl;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.TipoIntervencionRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.TipoIntervencionResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.TipoIntervencionMapper;
import com.clinica.psicologia.system.model.catalog.TipoIntervencion;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.TipoIntervencionRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.TipoIntervencionService;

@Service
public class TipoIntervencionServiceImpl
        extends AbstractCatalogService<TipoIntervencion, TipoIntervencionRequestDTO, TipoIntervencionResponseDTO>
        implements TipoIntervencionService {

    private final TipoIntervencionRepository repository;

    private final String duplicateMessage = "Intervention type already exists";

    public TipoIntervencionServiceImpl(
            TipoIntervencionRepository repository,
            EstadoRepository estadoRepository,
            TipoIntervencionMapper mapper) {

        super(
                repository,
                estadoRepository,
                mapper);

        this.repository = repository;
    }

    @Override
    protected TipoIntervencion createEntity() {

        return new TipoIntervencion();
    }

    @Override
    protected String getNombre(
            TipoIntervencionRequestDTO request) {

        return request.getNombre();
    }

    @Override
    protected Integer extractEstadoId(
            TipoIntervencionRequestDTO request) {

        return request.getEstadoId();
    }

    @Override
    protected void validateDuplicate(
            String nombre) {

        if (repository.existsByNombre(nombre)) {

            throw new DuplicateResourceException(
                    duplicateMessage);
        }
    }

    @Override
    protected void validateDuplicate(
            String nombre,
            Integer id) {

        if (repository.existsByNombreAndIdNot(
                nombre,
                id)) {

            throw new DuplicateResourceException(
                    duplicateMessage);
        }
    }
}
