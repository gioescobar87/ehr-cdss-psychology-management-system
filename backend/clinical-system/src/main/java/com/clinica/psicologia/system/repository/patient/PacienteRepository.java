package com.clinica.psicologia.system.repository.patient;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.patient.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, Long>{
    
}
