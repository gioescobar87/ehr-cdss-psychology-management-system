package com.clinica.psicologia.system.repository.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.catalog.Estado;

public interface EstadoRepository extends JpaRepository<Estado,Long> {
    
}
