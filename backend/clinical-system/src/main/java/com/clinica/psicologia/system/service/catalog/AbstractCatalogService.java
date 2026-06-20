package com.clinica.psicologia.system.service.catalog;

import java.util.List;

import com.clinica.psicologia.system.mapper.catalog.CatalogoMapper;
import com.clinica.psicologia.system.model.base.BaseCatalog;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.repository.catalog.CatalogRepository;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;

import jakarta.transaction.Transactional;

public abstract class AbstractCatalogService<
        ENTITY extends BaseCatalog,
        REQUEST,
        RESPONSE>
        implements CatalogService<REQUEST, RESPONSE> {

    protected final CatalogRepository<ENTITY> repository;

    protected final EstadoRepository estadoRepository;

    protected final CatalogoMapper<
            ENTITY,
            REQUEST,
            RESPONSE> mapper;

    protected AbstractCatalogService(
            CatalogRepository<ENTITY> repository,
            EstadoRepository estadoRepository,
            CatalogoMapper<
                    ENTITY,
                    REQUEST,
                    RESPONSE> mapper) {

        this.repository = repository;
        this.estadoRepository = estadoRepository;
        this.mapper = mapper;
    }

    protected abstract ENTITY createEntity();

    protected abstract String getNombre(REQUEST request);

    @Override
    public List<RESPONSE> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    public RESPONSE findById(Integer id) {
        ENTITY entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found - CAT"));

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional
    public RESPONSE create(REQUEST request) {
        validateDuplicate(getNombre(request));

        Estado estado = estadoRepository.findById(extractEstadoId(request))
                .orElseThrow(() -> new ResourceNotFoundException("State not found - CAT"));

        ENTITY entity = createEntity();

        mapper.updateEntity(entity, request);
        entity.setEstado(estado);

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public RESPONSE update(Integer id, REQUEST request) {

        ENTITY entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found - CAT"));

        validateDuplicate(getNombre(request), id);

        Estado estado = estadoRepository.findById(extractEstadoId(request))
                .orElseThrow(() -> new ResourceNotFoundException("State not found - CAT"));

        mapper.updateEntity(entity, request);
        entity.setEstado(estado);

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public void changeStatus(Integer id, Integer estadoId) {

        ENTITY entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found - CAT"));

        Estado estado = estadoRepository.findById(estadoId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found - CAT"));

        entity.setEstado(estado);

        repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Integer id) {

        ENTITY entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found - CAT"));

        repository.delete(entity);
    }

    protected abstract Integer extractEstadoId(REQUEST request);

    protected abstract void validateDuplicate(String nombre);

    protected abstract void validateDuplicate(String nombre, Integer id);
}
