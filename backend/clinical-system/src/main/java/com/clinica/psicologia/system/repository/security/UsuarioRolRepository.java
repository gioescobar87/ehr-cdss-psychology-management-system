package com.clinica.psicologia.system.repository.security;

import com.clinica.psicologia.system.model.security.Rol;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.model.security.UsuarioRol;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRolRepository extends JpaRepository<UsuarioRol, Integer> {

    List<UsuarioRol> findByUsuario(Usuario usuario);

    Optional<UsuarioRol> findByUsuarioAndRol(Usuario usuario, Rol rol);

    boolean existsByUsuarioAndRol(Usuario usuario, Rol rol);

    void deleteByUsuarioAndRol(Usuario usuario, Rol rol);

    boolean existsByRol(Rol rol);

    boolean existsByUsuarioAndRolNombre(Usuario usuario, String nombre);
}