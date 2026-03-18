package com.clinica.psicologia.system.repository.security;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.security.Rol;
import com.clinica.psicologia.system.model.security.RolPermiso;
import java.util.List;


public interface RolPermisoRepository extends JpaRepository<RolPermiso, Integer> {

    List<RolPermiso> findByRol(Rol rol);
    
}
