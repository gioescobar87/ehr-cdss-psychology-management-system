package com.clinica.psicologia.system.repository.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.catalog.Parentesco;

public interface ParentescoRepository extends JpaRepository<Parentesco,Integer> {
    
}
