package com.clinica.psicologia.system.repository.security;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.security.RefreshToken;
import com.clinica.psicologia.system.model.security.Usuario;


public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUsuarioId(Integer id);

    void deleteByUsuario(Usuario usuario);
}
