package com.clinica.psicologia.system.repository.clinical_context;


import java.util.List;

import com.clinica.psicologia.system.model.clinical.AplicacionPrueba;
import com.clinica.psicologia.system.model.clinical.EvaluacionRiesgo;
import com.clinica.psicologia.system.model.clinical.ObjetivoTerapia;
import com.clinica.psicologia.system.model.clinical.PacienteDiagnostico;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.patient.PacienteAlergia;

public interface ClinicalSessionContextRepository {

    List<PacienteDiagnostico> findActiveDiagnosesByPatientId(Integer pacienteId);

    List<PacienteAlergia> findAllergiesByPatientId(Integer pacienteId);

    List<AplicacionPrueba> findRecentPsychologicalTests(Integer pacienteId, int limit);

    long countPsychologicalTestsByPatientId(Integer pacienteId);

    List<EvaluacionRiesgo> findRecentRiskEvaluations(Integer pacienteId, int limit);

    long countRiskEvaluationsByPatientId(Integer pacienteId);

    List<ObjetivoTerapia> findActiveObjectivesByPatientId(Integer pacienteId);

    long countObjectivesByPatientId(Integer pacienteId);

    List<Sesion> findRecentSessions(Integer pacienteId, Integer currentSessionId, int limit);

    long countSessionsByPatientId(Integer pacienteId, Integer currentSessionId);
}