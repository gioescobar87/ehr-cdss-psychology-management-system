package com.clinica.psicologia.system.repository.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import com.clinica.psicologia.system.model.base.BaseCatalog;

@NoRepositoryBean
public interface CatalogRepository<T extends BaseCatalog> extends JpaRepository<T, Integer> {
    boolean existsByNombre(String nombre);

    boolean existsByNombreAndIdNot(String nombre, Integer id);
}