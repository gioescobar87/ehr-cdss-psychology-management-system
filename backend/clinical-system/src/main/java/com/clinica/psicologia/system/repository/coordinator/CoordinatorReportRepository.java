package com.clinica.psicologia.system.repository.coordinator;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.clinica.psicologia.system.model.CoordinatorPatientDiagnosisProjection;
import com.clinica.psicologia.system.model.CoordinatorPatientCountProjection;
import com.clinica.psicologia.system.model.CoordinatorAppointmentSessionProjection;
import com.clinica.psicologia.system.model.CoordinatorPatientSessionProjection;
import com.clinica.psicologia.system.model.CoordinatorSummaryMetricsProjection;
import com.clinica.psicologia.system.model.clinical.Cita;
import com.clinica.psicologia.system.model.clinical.Cancelacion;
import com.clinica.psicologia.system.model.patient.PacienteAsignacion;
import com.clinica.psicologia.system.model.security.Usuario;

public interface CoordinatorReportRepository extends JpaRepository<Cita, Integer> {

  @Query("""
      SELECT cancellation FROM Cancelacion cancellation
      JOIN FETCH cancellation.cita appointment
      JOIN FETCH appointment.paciente patient
      JOIN FETCH appointment.usuario psychologist
      LEFT JOIN FETCH cancellation.usuario cancelledBy
      WHERE psychologist.coordinador.id = :coordinatorId
      ORDER BY cancellation.fechaCancelacion DESC
      """)
  List<Cancelacion> findScopedCancellations(
      @Param("coordinatorId") Integer coordinatorId);

  @Query("""
      SELECT u FROM Usuario u
      WHERE u.coordinador.id = :coordinatorId
      ORDER BY u.nombre, u.apellido
      """)
  List<Usuario> findPsychologists(
      @Param("coordinatorId") Integer coordinatorId);

    @Query("""
            SELECT c.usuario.id AS psychologistId,
                         COUNT(c.id) AS appointmentCount,
                         SUM(CASE WHEN e.nombre = 'COMPLETADA' THEN 1 ELSE 0 END) AS attendedCount,
                         SUM(CASE WHEN EXISTS (
                                     SELECT cancellation.id
                                     FROM Cancelacion cancellation
                                     WHERE cancellation.cita.id = c.id
                                 ) THEN 1 ELSE 0 END) AS cancelledCount
            FROM Cita c
            JOIN c.usuario u
            JOIN c.estado e
            WHERE u.coordinador.id = :coordinatorId
                AND c.fechaHoraInicio >= :startDate
                AND c.fechaHoraInicio < :endDate
            GROUP BY c.usuario.id
            """)
    List<CoordinatorSummaryMetricsProjection> findSummaryMetrics(
            @Param("coordinatorId") Integer coordinatorId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("""
            SELECT assignment.psicologo.id AS psychologistId,
                         COUNT(DISTINCT assignment.paciente.id) AS patientCount
            FROM PacienteAsignacion assignment
            WHERE assignment.psicologo.coordinador.id = :coordinatorId
                AND assignment.fechaFin IS NULL
            GROUP BY assignment.psicologo.id
            """)
    List<CoordinatorPatientCountProjection> findCurrentPatientCounts(
            @Param("coordinatorId") Integer coordinatorId);

  @Query("""
      SELECT c FROM Cita c
      JOIN FETCH c.usuario u
      JOIN FETCH c.paciente p
      JOIN FETCH c.estado e
      WHERE u.coordinador.id = :coordinatorId
        AND c.fechaHoraInicio >= :startDate
        AND c.fechaHoraInicio < :endDate
      ORDER BY c.fechaHoraInicio
      """)
  List<Cita> findScopedAppointments(
      @Param("coordinatorId") Integer coordinatorId,
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate);

  @Query("""
      SELECT a FROM PacienteAsignacion a
      JOIN FETCH a.paciente p
      JOIN FETCH p.estado pe
      JOIN FETCH a.psicologo u
      WHERE u.coordinador.id = :coordinatorId
        AND a.fechaFin IS NULL
      ORDER BY p.apellido, p.nombre
      """)
  List<PacienteAsignacion> findCurrentAssignments(
      @Param("coordinatorId") Integer coordinatorId);

  @Query("""
      SELECT DISTINCT ca.cita.id FROM Cancelacion ca
      JOIN ca.cita c
      WHERE c.usuario.coordinador.id = :coordinatorId
        AND c.fechaHoraInicio >= :startDate
        AND c.fechaHoraInicio < :endDate
      """)
  List<Integer> findCancelledAppointmentIds(
      @Param("coordinatorId") Integer coordinatorId,
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate);

    @Query("""
            SELECT assignment
            FROM PacienteAsignacion assignment
            JOIN FETCH assignment.paciente p
            JOIN FETCH assignment.psicologo psychologist
            JOIN FETCH p.estado patientStatus
            WHERE psychologist.coordinador.id = :coordinatorId
                AND assignment.fechaFin IS NULL
                AND (
                            :psychologistId IS NULL
                            OR psychologist.id = :psychologistId
                        )
                AND (
                            :status IS NULL
                            OR :status = ''
                            OR LOWER(patientStatus.nombre) = LOWER(:status)
                        )
            ORDER BY p.apellido, p.nombre
            """)
    List<PacienteAsignacion> findPatients(
      @Param("coordinatorId") Integer coordinatorId,
      @Param("status") String status,
            @Param("psychologistId") Integer psychologistId);

  @Query("""
      SELECT
          pd.paciente.id AS patientId,
          d.id AS diagnosisId,
          d.codigoDsm AS code,
          d.nombre AS name,
          pd.fechaDiagnostico AS diagnosisDate,
          pd.diagnosticoInicial AS initial
      FROM PacienteDiagnostico pd
      JOIN pd.diagnostico d
      WHERE pd.paciente.id IN :patientIds
      ORDER BY pd.fechaDiagnostico DESC
      """)
  List<CoordinatorPatientDiagnosisProjection> findPatientDiagnoses(
      @Param("patientIds") Collection<Integer> patientIds);

  @Query("""
      SELECT s.paciente.id AS patientId, s.id AS sessionId
      FROM Sesion s
      WHERE s.paciente.id IN :patientIds
        AND NOT EXISTS (
              SELECT newer.id
              FROM Sesion newer
              WHERE newer.paciente.id = s.paciente.id
                AND (
                      newer.fechaSesion > s.fechaSesion
                      OR (
                            newer.fechaSesion = s.fechaSesion
                            AND newer.id > s.id
                         )
                    )
            )
      """)
  List<CoordinatorPatientSessionProjection> findLatestPatientSessions(
      @Param("patientIds") Collection<Integer> patientIds);

  @Query("""
      SELECT s.cita.id AS appointmentId, MIN(s.id) AS sessionId
      FROM Sesion s
      WHERE s.cita.id IN :appointmentIds
      GROUP BY s.cita.id
      """)
  List<CoordinatorAppointmentSessionProjection> findSessionsByAppointmentIds(
      @Param("appointmentIds") Collection<Integer> appointmentIds);
}
