package com.clinica.psicologia.system.repository.clinical;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.Sesion;

public interface SesionRepository extends JpaRepository<Sesion, Integer> {
    List<Sesion> findByPacienteId(Integer pacienteId);

    List<Sesion> findByUsuarioId(Integer usuarioId);

    List<Sesion> findByPacienteIdOrderByFechaSesionDesc(Integer pacienteId);

    List<Sesion> findByUsuarioIdOrderByFechaSesionDesc(Integer usuarioId);

    List<Sesion> findByPacienteIdAndEstadoIdOrderByFechaSesionDesc(Integer pacienteId, Integer estadoId);
}
