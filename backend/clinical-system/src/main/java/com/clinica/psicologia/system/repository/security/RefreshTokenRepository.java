package com.clinica.psicologia.system.repository.security;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.security.RefreshToken;


public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUsuarioIdUsuario(Integer idUsuario);
}
