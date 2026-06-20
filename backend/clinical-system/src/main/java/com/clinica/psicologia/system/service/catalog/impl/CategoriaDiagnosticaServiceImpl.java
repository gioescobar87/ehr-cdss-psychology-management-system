package com.clinica.psicologia.system.service.catalog.impl;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.CategoriaDiagnosticaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.CategoriaDiagnosticaResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.CategoriaDiagnosticaMapper;
import com.clinica.psicologia.system.model.catalog.CategoriaDiagnostica;
import com.clinica.psicologia.system.repository.catalog.CategoriaDiagnosticaRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.CategoriaDiagnosticaService;

@Service
public class CategoriaDiagnosticaServiceImpl extends
        AbstractCatalogService<CategoriaDiagnostica, CategoriaDiagnosticaRequestDTO, CategoriaDiagnosticaResponseDTO>
        implements CategoriaDiagnosticaService {

    private final CategoriaDiagnosticaRepository repository;

    public CategoriaDiagnosticaServiceImpl(
            CategoriaDiagnosticaRepository repository,
            EstadoRepository estadoRepository,
            CategoriaDiagnosticaMapper mapper) {

        super(
                repository,
                estadoRepository,
                mapper);

        this.repository = repository;
    }

    @Override
    protected CategoriaDiagnostica createEntity() {

        return new CategoriaDiagnostica();
    }

    @Override
    protected String getNombre(
            CategoriaDiagnosticaRequestDTO request) {

        return request.getNombre();
    }

    @Override
    protected Integer extractEstadoId(
            CategoriaDiagnosticaRequestDTO request) {

        return request.getEstadoId();
    }

    @Override
    protected void validateDuplicate(
            String nombre) {

        if (repository.existsByNombre(nombre)) {

            throw new DuplicateResourceException(
                    "Marital status already exists");
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
                    "Marital status already exists");
        }
    }
}
