package com.clinica.psicologia.system.repository.security;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.security.Permiso;
import com.clinica.psicologia.system.model.security.Rol;
import com.clinica.psicologia.system.model.security.RolPermiso;
import java.util.List;
import java.util.Optional;


public interface RolPermisoRepository extends JpaRepository<RolPermiso, Integer> {

    List<RolPermiso> findByRol(Rol rol);

    boolean existsByPermiso(Permiso permiso);
    
    Optional<RolPermiso> findByRolAndPermiso(Rol rol,Permiso permiso);

    boolean existsByRolAndPermiso(Rol rol, Permiso permiso);
}