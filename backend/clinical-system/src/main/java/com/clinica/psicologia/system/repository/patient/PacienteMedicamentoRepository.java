package com.clinica.psicologia.system.repository.patient;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.patient.PacienteMedicamento;

public interface PacienteMedicamentoRepository extends JpaRepository<PacienteMedicamento, Integer> {

    List<PacienteMedicamento> findByPacienteId(Integer pacienteId);
}