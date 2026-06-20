package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import com.clinica.psicologia.system.model.base.BaseCatalog;

public interface CatalogoMapper<ENTITY extends BaseCatalog, REQUEST, RESPONSE> {
    RESPONSE toResponse(ENTITY entity);

    List<RESPONSE> toResponseList(List<ENTITY> entities);

    void updateEntity(ENTITY entity, REQUEST request);
}
