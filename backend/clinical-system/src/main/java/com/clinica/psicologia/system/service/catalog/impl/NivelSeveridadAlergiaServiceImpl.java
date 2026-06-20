package com.clinica.psicologia.system.service.catalog.impl;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.NivelSeveridadAlergiaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.NivelSeveridadAlergiaResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.NivelSeveridadAlergiaMapper;
import com.clinica.psicologia.system.model.catalog.NivelSeveridadAlergia;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.NivelSeveridadAlergiaRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.NivelSeveridadAlergiaService;

@Service
public class NivelSeveridadAlergiaServiceImpl extends AbstractCatalogService<NivelSeveridadAlergia, NivelSeveridadAlergiaRequestDTO, NivelSeveridadAlergiaResponseDTO> implements NivelSeveridadAlergiaService {
    private final NivelSeveridadAlergiaRepository repository;

    private final String duplicateMessage = "Risk level already exists";

    public NivelSeveridadAlergiaServiceImpl(
            NivelSeveridadAlergiaRepository repository,
            EstadoRepository estadoRepository,
            NivelSeveridadAlergiaMapper mapper) {

        super(
                repository,
                estadoRepository,
                mapper);

        this.repository = repository;
    }

    @Override
    protected NivelSeveridadAlergia createEntity() {

        return new NivelSeveridadAlergia();
    }

    @Override
    protected String getNombre(
            NivelSeveridadAlergiaRequestDTO request) {

        return request.getNombre();
    }

    @Override
    protected Integer extractEstadoId(
            NivelSeveridadAlergiaRequestDTO request) {

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
