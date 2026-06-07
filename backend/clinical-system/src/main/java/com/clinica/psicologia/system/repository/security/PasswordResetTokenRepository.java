package com.clinica.psicologia.system.repository.security;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.clinica.psicologia.system.model.security.PasswordResetToken;
import com.clinica.psicologia.system.model.security.Usuario;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Integer> {

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUsuario(Usuario usuario);

    @Modifying
    @Query("""
                DELETE FROM PasswordResetToken p
                WHERE p.usado = true
                   OR p.fechaExpiracion < :fecha
            """)
    int cleanup(LocalDateTime fecha);
}