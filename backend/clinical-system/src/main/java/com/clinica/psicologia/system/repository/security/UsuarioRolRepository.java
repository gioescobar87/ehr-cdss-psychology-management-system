package com.clinica.psicologia.system.repository.security;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.model.security.UsuarioRol;

public interface UsuarioRolRepository extends JpaRepository<UsuarioRol, Integer>{
    List<UsuarioRol> findByUsuario(Usuario usuario);
}
