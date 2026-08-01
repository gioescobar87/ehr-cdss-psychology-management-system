package com.clinica.psicologia.system.repository.catalog;

import com.clinica.psicologia.system.model.catalog.CriterioClinico;

public interface CriterioClinicoRepository extends CatalogRepository<CriterioClinico> {

        boolean existsByNombre(String nombre);

        boolean existsByNombreAndIdNot(String nombre, Integer id);
}