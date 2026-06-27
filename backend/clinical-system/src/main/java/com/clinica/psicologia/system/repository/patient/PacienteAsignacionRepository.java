package com.clinica.psicologia.system.repository.patient;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.patient.PacienteAsignacion;

import jakarta.transaction.Transactional;

public interface PacienteAsignacionRepository extends JpaRepository<PacienteAsignacion, Integer> {

        List<PacienteAsignacion> findByPacienteIdOrderByFechaAsignacionDesc(Integer pacienteId);

        Optional<PacienteAsignacion> findFirstByPacienteIdAndFechaFinIsNull(Integer pacienteId);

        @Transactional
        void deleteByPaciente(Paciente paciente);
}