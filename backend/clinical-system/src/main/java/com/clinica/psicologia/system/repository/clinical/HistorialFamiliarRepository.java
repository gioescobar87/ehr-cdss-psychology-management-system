package com.clinica.psicologia.system.repository.clinical;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.HistorialFamiliar;

public interface HistorialFamiliarRepository extends JpaRepository<HistorialFamiliar,Integer>{
    List<HistorialFamiliar> findByPacienteId(Integer pacienteId);
}
