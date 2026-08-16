package com.clinica.psicologia.system.serv_implementation.catalog;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.TipoRiesgoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.TipoRiesgoResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.TipoRiesgoMapper;
import com.clinica.psicologia.system.model.catalog.TipoRiesgo;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.catalog.TipoRiesgoRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.TipoRiesgoService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

@Service
public class TipoRiesgoServiceImpl extends AbstractCatalogService<TipoRiesgo, TipoRiesgoRequestDTO, TipoRiesgoResponseDTO> implements TipoRiesgoService {
    private final TipoRiesgoRepository repository;

    private final String duplicateMessage = "Risk type already exists";

    public TipoRiesgoServiceImpl(
            TipoRiesgoRepository repository,
            EstadoRepository estadoRepository,
            ApplicationSupportService supportService,
            TipoRiesgoMapper mapper) {

        super(
                repository,
                estadoRepository,
                supportService,
                mapper);

        this.repository = repository;
    }

    @Override
    protected TipoRiesgo createEntity() {

        return new TipoRiesgo();
    }

    @Override
    protected String getNombre(
            TipoRiesgoRequestDTO request) {

        return request.getNombre();
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
