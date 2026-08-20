package com.clinica.psicologia.system.repository.clinical_context;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.clinical.AplicacionPrueba;
import com.clinica.psicologia.system.model.clinical.EvaluacionRiesgo;
import com.clinica.psicologia.system.model.clinical.ObjetivoTerapia;
import com.clinica.psicologia.system.model.clinical.PacienteDiagnostico;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.patient.PacienteAlergia;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class ClinicalSessionContextRepositoryImpl
                implements ClinicalSessionContextRepository {

        @PersistenceContext
        private EntityManager entityManager;

        @Override
        public List<PacienteDiagnostico> findActiveDiagnosesByPatientId(Integer pacienteId) {

                return entityManager.createQuery(
                                """
                                                SELECT pd
                                                FROM PacienteDiagnostico pd
                                                WHERE pd.paciente.id = :pacienteId
                                                  AND pd.estado.id = (
                                                      SELECT e.id
                                                      FROM Estado e
                                                      WHERE UPPER(e.nombre) = 'ACTIVO'
                                                  )
                                                ORDER BY pd.fechaDiagnostico DESC
                                                """,
                                PacienteDiagnostico.class)
                                .setParameter("pacienteId", pacienteId)
                                .getResultList();
        }

        @Override
        public List<PacienteAlergia> findAllergiesByPatientId(Integer pacienteId) {

                return entityManager.createQuery(
                                """
                                                SELECT pa
                                                FROM PacienteAlergia pa
                                                WHERE pa.paciente.id = :pacienteId
                                                ORDER BY pa.id DESC
                                                """,
                                PacienteAlergia.class)
                                .setParameter("pacienteId", pacienteId)
                                .getResultList();
        }

        @Override
        public List<AplicacionPrueba> findRecentPsychologicalTests(
                        Integer pacienteId,
                        int limit) {

                return entityManager.createQuery("""
                                SELECT ap
                                FROM AplicacionPrueba ap
                                WHERE ap.sesion.paciente.id = :pacienteId
                                ORDER BY ap.fechaAplicacion DESC, ap.id DESC
                                """, AplicacionPrueba.class)
                                .setParameter("pacienteId", pacienteId)
                                .setMaxResults(limit)
                                .getResultList();
        }

        @Override
        public long countPsychologicalTestsByPatientId(Integer pacienteId) {

                return entityManager.createQuery("""
                                SELECT COUNT(ap)
                                FROM AplicacionPrueba ap
                                WHERE ap.sesion.paciente.id = :pacienteId
                                """, Long.class)
                                .setParameter("pacienteId", pacienteId)
                                .getSingleResult();
        }

        @Override
        public List<EvaluacionRiesgo> findRecentRiskEvaluations(
                        Integer pacienteId,
                        int limit) {

                return entityManager.createQuery(
                                """
                                                SELECT er
                                                FROM EvaluacionRiesgo er
                                                WHERE er.paciente.id = :pacienteId
                                                ORDER BY er.fecha DESC, er.id DESC
                                                """,
                                EvaluacionRiesgo.class)
                                .setParameter("pacienteId", pacienteId)
                                .setMaxResults(limit)
                                .getResultList();
        }

        @Override
        public long countRiskEvaluationsByPatientId(Integer pacienteId) {

                return entityManager.createQuery(
                                """
                                                SELECT COUNT(er)
                                                FROM EvaluacionRiesgo er
                                                WHERE er.paciente.id = :pacienteId
                                                """,
                                Long.class)
                                .setParameter("pacienteId", pacienteId)
                                .getSingleResult();
        }

        @Override
        public List<ObjetivoTerapia> findActiveObjectivesByPatientId(
                        Integer pacienteId) {

                return entityManager.createQuery(
                                """
                                                SELECT ot
                                                FROM ObjetivoTerapia ot
                                                WHERE ot.planTratamiento.pacienteDiagnostico.paciente.id = :pacienteId
                                                  AND ot.estado.id = (
                                                      SELECT e.id
                                                      FROM Estado e
                                                      WHERE UPPER(e.nombre) = 'ACTIVO'
                                                  )
                                                ORDER BY ot.fechaInicio DESC, ot.id DESC
                                                """,
                                ObjetivoTerapia.class)
                                .setParameter("pacienteId", pacienteId)
                                .getResultList();
        }

        @Override
        public long countObjectivesByPatientId(Integer pacienteId) {

                return entityManager.createQuery(
                                """
                                                SELECT COUNT(ot)
                                                FROM ObjetivoTerapia ot
                                                WHERE ot.planTratamiento.pacienteDiagnostico.paciente.id = :pacienteId
                                                  AND ot.estado.id = (
                                                      SELECT e.id
                                                      FROM Estado e
                                                      WHERE UPPER(e.nombre) = 'ACTIVO'
                                                  )
                                                """,
                                Long.class)
                                .setParameter("pacienteId", pacienteId)
                                .getSingleResult();
        }

        @Override
        public List<Sesion> findRecentSessions(
                        Integer pacienteId,
                        Integer currentSessionId,
                        int limit) {

                return entityManager.createQuery(
                                """
                                                SELECT s
                                                FROM Sesion s
                                                WHERE s.paciente.id = :pacienteId
                                                  AND s.id <> :currentSessionId
                                                ORDER BY s.fechaSesion DESC, s.id DESC
                                                """,
                                Sesion.class)
                                .setParameter("pacienteId", pacienteId)
                                .setParameter("currentSessionId", currentSessionId)
                                .setMaxResults(limit)
                                .getResultList();
        }

        @Override
        public long countSessionsByPatientId(
                        Integer pacienteId,
                        Integer currentSessionId) {

                return entityManager.createQuery(
                                """
                                                SELECT COUNT(s)
                                                FROM Sesion s
                                                WHERE s.paciente.id = :pacienteId
                                                  AND s.id <> :currentSessionId
                                                """,
                                Long.class)
                                .setParameter("pacienteId", pacienteId)
                                .setParameter("currentSessionId", currentSessionId)
                                .getSingleResult();
        }
}