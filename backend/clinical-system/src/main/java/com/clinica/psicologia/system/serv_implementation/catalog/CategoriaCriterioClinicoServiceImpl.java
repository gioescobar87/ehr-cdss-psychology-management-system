package com.clinica.psicologia.system.serv_implementation.catalog;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.CategoriaCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.CategoriaCriterioClinicoResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.CategoriaCriterioClinicoMapper;
import com.clinica.psicologia.system.model.catalog.CategoriaCriterioClinico;
import com.clinica.psicologia.system.repository.catalog.CategoriaCriterioClinicoRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.service.catalog.AbstractCatalogService;
import com.clinica.psicologia.system.service.catalog.CategoriaCriterioClinicoService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;

@Service
public class CategoriaCriterioClinicoServiceImpl extends
        AbstractCatalogService<CategoriaCriterioClinico, CategoriaCriterioClinicoRequestDTO, CategoriaCriterioClinicoResponseDTO>
        implements CategoriaCriterioClinicoService {

    private final CategoriaCriterioClinicoRepository repository;

    public CategoriaCriterioClinicoServiceImpl(
            CategoriaCriterioClinicoRepository repository,
            EstadoRepository estadoRepository,
            ApplicationSupportService supportService,
            CategoriaCriterioClinicoMapper mapper) {

        super(
                repository,
                estadoRepository,
                supportService,
                mapper);

        this.repository = repository;
    }

    @Override
    protected CategoriaCriterioClinico createEntity() {
        return new CategoriaCriterioClinico();
    }

    @Override
    protected String getNombre(CategoriaCriterioClinicoRequestDTO request) {
        return request.getNombre();
    }

    @Override
    protected void validateDuplicate(String nombre) {
        if (repository.existsByNombre(nombre)) {
            throw new DuplicateResourceException("Marital status already exists");
        }
    }

    @Override
    protected void validateDuplicate(String nombre, Integer id) {

        if (repository.existsByNombreAndIdNot(nombre,id)) {
            throw new DuplicateResourceException("Marital status already exists");
        }
    }
}
