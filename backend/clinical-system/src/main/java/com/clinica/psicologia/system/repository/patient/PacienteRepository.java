package com.clinica.psicologia.system.repository.patient;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.patient.Paciente;

import java.util.List;

public interface PacienteRepository extends JpaRepository<Paciente, Integer>{
	List<Paciente> findByIdInAndEstadoId(List<Integer> ids, Integer estadoId);
}
