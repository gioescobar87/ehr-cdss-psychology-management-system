package com.clinica.psicologia.system.repository.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.base.BaseCatalog;

public interface CatalogRepository<T extends BaseCatalog> extends JpaRepository<T, Integer> {
    
}
