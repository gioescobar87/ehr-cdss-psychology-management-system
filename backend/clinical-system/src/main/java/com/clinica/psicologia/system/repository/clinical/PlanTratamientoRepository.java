package com.clinica.psicologia.system.repository.clinical;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.PlanTratamiento;

public interface PlanTratamientoRepository extends JpaRepository<PlanTratamiento, Long>{
    
}
