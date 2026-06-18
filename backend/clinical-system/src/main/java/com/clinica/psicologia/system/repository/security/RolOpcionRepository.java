package com.clinica.psicologia.system.repository.security;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.security.RolOpcion;

public interface RolOpcionRepository extends JpaRepository<RolOpcion, Integer> {
    List<RolOpcion> findByRolId(Integer rolId);

    boolean existsByRolIdAndOpcionId(
            Integer rolId,
            Integer opcionId);

    void deleteByRolIdAndOpcionId(
            Integer rolId,
            Integer opcionId);
}
