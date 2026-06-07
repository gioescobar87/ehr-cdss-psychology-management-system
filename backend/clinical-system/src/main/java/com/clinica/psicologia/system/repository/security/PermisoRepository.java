package com.clinica.psicologia.system.repository.security;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.security.Permiso;

public interface PermisoRepository extends JpaRepository<Permiso, Integer> {

}