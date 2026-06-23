package com.clinica.psicologia.system.repository.catalog;

import com.clinica.psicologia.system.model.catalog.SustanciaAlergena;

public interface SustanciaAlergenaRepository extends CatalogRepository<SustanciaAlergena> {

    boolean existsByNombre(String nombre);

    boolean existsByNombreAndIdNot(String nombre, Integer id);
}