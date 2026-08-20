package com.clinica.psicologia.system.repository.clinical;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.Cita;

public interface CitaRepository extends JpaRepository<Cita, Integer> {

        List<Cita> findByPacienteId(Integer pacienteId);

        List<Cita> findByUsuarioId(Integer usuarioId);

        List<Cita> findByFechaHoraInicioBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);

        List<Cita> findByUsuarioIdAndFechaHoraInicioBetween(
                        Integer usuarioId,
                        LocalDateTime fechaInicio,
                        LocalDateTime fechaFin);

        List<Cita> findByPacienteIdAndFechaHoraInicioBetween(
                        Integer pacienteId,
                        LocalDateTime fechaInicio,
                        LocalDateTime fechaFin);

        boolean existsByUsuarioIdAndFechaHoraInicioLessThanAndFechaHoraFinGreaterThan(
                        Integer usuarioId,
                        LocalDateTime fechaHoraFin,
                        LocalDateTime fechaHoraInicio);

        boolean existsByPacienteIdAndFechaHoraInicioLessThanAndFechaHoraFinGreaterThan(
                        Integer pacienteId,
                        LocalDateTime fechaHoraFin,
                        LocalDateTime fechaHoraInicio);

        boolean existsByUsuarioIdAndEstadoIdNotAndFechaHoraInicioLessThanAndFechaHoraFinGreaterThan(
                        Integer usuarioId,
                        Integer estadoId,
                        LocalDateTime fechaHoraInicio,
                        LocalDateTime fechaHoraFin);

        boolean existsByPacienteIdAndEstadoIdNotAndFechaHoraInicioLessThanAndFechaHoraFinGreaterThan(
                        Integer pacienteId,
                        Integer estadoId,
                        LocalDateTime fechaHoraInicio,
                        LocalDateTime fechaHoraFin);
}