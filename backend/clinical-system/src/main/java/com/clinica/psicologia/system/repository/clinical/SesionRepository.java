package com.clinica.psicologia.system.repository.clinical;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.clinica.psicologia.system.model.clinical.Sesion;

public interface SesionRepository extends JpaRepository<Sesion, Integer> {
        List<Sesion> findByPacienteId(Integer pacienteId);

        List<Sesion> findByUsuarioId(Integer usuarioId);

        List<Sesion> findByPacienteIdOrderByFechaSesionDesc(Integer pacienteId);

        List<Sesion> findByUsuarioIdOrderByFechaSesionDesc(Integer usuarioId);

        @Query("""
                            SELECT s
                            FROM Sesion s
                            WHERE s.usuario.id = :usuarioId
                              AND EXISTS (
                                    SELECT 1
                                    FROM PacienteAsignacion pa
                                    WHERE pa.paciente.id = s.paciente.id
                                      AND pa.psicologo.id = :usuarioId
                                      AND pa.fechaFin IS NULL
                              )
                            ORDER BY s.fechaSesion DESC
                        """)
        List<Sesion> findByUsuarioIdAndActiveAssignmentOrderByFechaSesionDesc(
                        @Param("usuarioId") Integer usuarioId);

        List<Sesion> findByPacienteIdAndEstadoIdOrderByFechaSesionDesc(Integer pacienteId, Integer estadoId);

        boolean existsByPacienteIdAndUsuarioIdAndFechaSesion(Integer pacienteId, Integer usuarioId,
                        LocalDateTime fechaSesion);

        boolean existsByPacienteIdAndUsuarioIdAndFechaSesionAndIdNot(Integer pacienteId, Integer usuarioId,
                        LocalDateTime fechaSesion,
                        Integer id);

        List<Sesion> findByCitaId(Integer citaId);

        Optional<Sesion> findFirstByCitaId(Integer citaId);

        boolean existsByCitaId(Integer citaId);
}
