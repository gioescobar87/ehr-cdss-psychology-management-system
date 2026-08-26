package com.clinica.psicologia.system.repository.clinical;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.PlanTratamiento;

public interface PlanTratamientoRepository extends JpaRepository<PlanTratamiento, Integer> {

    List<PlanTratamiento> findByPacienteDiagnosticoId(Integer pacienteDiagnosticoId);

    List<PlanTratamiento> findByPacienteDiagnostico_Paciente_IdOrderByFechaInicioDesc(Integer pacienteId);

    boolean existsByPacienteDiagnosticoIdAndEstadoId(Integer pacienteDiagnosticoId, Integer estadoId);
}