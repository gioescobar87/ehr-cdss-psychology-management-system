package com.clinica.psicologia.system.repository.clinical;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.NotaSesion;

public interface NotaSesionRepository extends JpaRepository<NotaSesion, Integer>{
    List<NotaSesion> findBySesionIdOrderByFechaRegistroAsc(Integer sesionId);

    List<NotaSesion> findByUsuarioIdOrderByFechaRegistroDesc(Integer usuarioId);
}
