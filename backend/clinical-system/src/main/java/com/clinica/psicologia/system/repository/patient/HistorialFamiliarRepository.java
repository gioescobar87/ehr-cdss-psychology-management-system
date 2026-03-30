package com.clinica.psicologia.system.repository.patient;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.HistorialFamiliar;

public interface HistorialFamiliarRepository extends JpaRepository<HistorialFamiliar, Long>{
    
}
