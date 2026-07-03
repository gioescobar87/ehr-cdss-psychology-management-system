package com.clinica.psicologia.system.repository.catalog;

import com.clinica.psicologia.system.model.catalog.Diagnostico;

public interface DiagnosticoRepository
        extends CatalogRepository<Diagnostico> {

    boolean existsByNombre(String nombre);

    boolean existsByNombreAndIdNot(String nombre, Integer id);
}