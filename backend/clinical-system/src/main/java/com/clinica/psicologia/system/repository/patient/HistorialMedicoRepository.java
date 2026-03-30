package com.clinica.psicologia.system.repository.patient;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.HistorialMedico;

public interface HistorialMedicoRepository extends JpaRepository<HistorialMedico, Long>{
    
}
