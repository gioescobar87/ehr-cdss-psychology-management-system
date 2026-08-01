package com.clinica.psicologia.system.repository.expert_system;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.expert_system.EvaluacionDiagnostica;

public interface EvaluacionDiagnosticaRepository extends JpaRepository<EvaluacionDiagnostica, Integer> {

    List<EvaluacionDiagnostica> findBySesionPacienteIdOrderByFechaEvaluacionDesc(Integer pacienteId);

    List<EvaluacionDiagnostica> findBySesionIdOrderByFechaEvaluacionDesc(Integer sesionId);

    List<EvaluacionDiagnostica> findByUsuarioIdOrderByFechaEvaluacionDesc(Integer usuarioId);

    boolean existsBySesionId(Integer sesionId);

    boolean existsBySesionIdAndIdNot(Integer sesionId, Integer id);
}