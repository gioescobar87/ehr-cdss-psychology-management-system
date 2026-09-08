package com.clinica.psicologia.system.repository.report;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.clinica.psicologia.system.model.clinical.Cita;
import com.clinica.psicologia.system.model.patient.PacienteAsignacion;
import com.clinica.psicologia.system.model.security.Usuario;

public interface CoordinatorReportRepository extends JpaRepository<Cita, Integer> {

    @Query("""
        SELECT u FROM Usuario u
        WHERE u.coordinador.id = :coordinatorId
        ORDER BY u.nombre, u.apellido
        """)
    List<Usuario> findPsychologists(@Param("coordinatorId") Integer coordinatorId);

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
    List<PacienteAsignacion> findCurrentAssignments(@Param("coordinatorId") Integer coordinatorId);

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
}
