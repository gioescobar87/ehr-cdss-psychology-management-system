package com.clinica.psicologia.system.repository.security;

import com.clinica.psicologia.system.model.security.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository
        extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByUsername(String username);
}