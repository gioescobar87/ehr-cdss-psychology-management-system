package com.clinica.psicologia.system.serv_implementation.catalog;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.EstadoCivilRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.EstadoCivilResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.EstadoCivilMapper;
import com.clinica.psicologia.system.model.catalog.EstadoCivil;
import com.clinica.psicologia.system.repository.catalog.EstadoCivilRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.EstadoCivilService;

@Service
public class EstadoCivilServiceImpl
        extends AbstractCatalogService<EstadoCivil, EstadoCivilRequestDTO, EstadoCivilResponseDTO>
        implements EstadoCivilService {

    private final EstadoCivilRepository repository;

    public EstadoCivilServiceImpl(
            EstadoCivilRepository repository,
            EstadoRepository estadoRepository,
            EstadoCivilMapper mapper) {

        super(
                repository,
                estadoRepository,
                mapper);

        this.repository = repository;
    }

    @Override
    protected EstadoCivil createEntity() {

        return new EstadoCivil();
    }

    @Override
    protected String getNombre(
            EstadoCivilRequestDTO request) {

        return request.getNombre();
    }

    @Override
    protected Integer extractEstadoId(
            EstadoCivilRequestDTO request) {

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
