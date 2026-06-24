package com.clinica.psicologia.system.repository.patient;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.patient.PacienteAlergia;

public interface PacienteAlergiaRepository extends JpaRepository<PacienteAlergia, Integer> {

    List<PacienteAlergia> findByPacienteId(Integer pacienteId);
}