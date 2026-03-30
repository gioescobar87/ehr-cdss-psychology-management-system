package com.clinica.psicologia.system.repository.clinical;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.Sesion;

public interface SesionRepository extends JpaRepository<Sesion, Long>{
    
}
