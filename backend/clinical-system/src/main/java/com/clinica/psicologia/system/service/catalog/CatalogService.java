package com.clinica.psicologia.system.service.catalog;

import java.util.List;

public interface CatalogService<REQUEST, RESPONSE> {
    List<RESPONSE> findAll();

    RESPONSE findById(Integer id);

    RESPONSE create(REQUEST request);

    RESPONSE update(Integer id, REQUEST request);

    void changeStatus(Integer id, Integer estadoId);

    void delete(Integer id);
}
