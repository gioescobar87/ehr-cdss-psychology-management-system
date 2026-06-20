package com.clinica.psicologia.system.serv_implementation.catalog;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.TipoSesionRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.TipoSesionResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.TipoSesionMapper;
import com.clinica.psicologia.system.model.catalog.TipoSesion;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.TipoSesionRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.TipoSesionService;

@Service
public class TipoSesionServiceImpl extends
        AbstractCatalogService<TipoSesion, TipoSesionRequestDTO, TipoSesionResponseDTO> implements TipoSesionService {

    private final TipoSesionRepository repository;

    private final String duplicateMessage = "Risk level already exists";

    public TipoSesionServiceImpl(
            TipoSesionRepository repository,
            EstadoRepository estadoRepository,
            TipoSesionMapper mapper) {

        super(
                repository,
                estadoRepository,
                mapper);

        this.repository = repository;
    }

    @Override
    protected TipoSesion createEntity() {

        return new TipoSesion();
    }

    @Override
    protected String getNombre(
            TipoSesionRequestDTO request) {

        return request.getNombre();
    }

    @Override
    protected Integer extractEstadoId(
            TipoSesionRequestDTO request) {

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
