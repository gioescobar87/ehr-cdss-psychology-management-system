package com.clinica.psicologia.system.security.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.model.security.RefreshToken;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.security.RefreshTokenRepository;
import com.clinica.psicologia.system.repository.security.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class RefreshTokenService {
    private final RefreshTokenRepository repository;
    private final UsuarioRepository usuarioRepository;

    private final long refreshDuration = 1000L * 60 * 60 * 3; // 30 minutes

    public RefreshTokenService(RefreshTokenRepository repository, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public RefreshToken createRefreshToken(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username).orElseThrow();

        repository.deleteByUsuarioIdUsuario(usuario.getIdUsuario());
        RefreshToken token = new RefreshToken();
        token.setUsuario(usuario);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiration(Instant.now().plusMillis(refreshDuration));

        return repository.save(token);
    }

    @Transactional
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiration().isBefore(Instant.now())) {
            repository.delete(token);
            throw new RuntimeException("Refresh token expired");
        }
        return token;
    }

    @Transactional
    public RefreshToken rotateRefreshToken(String oldToken) {
        RefreshToken token = repository.findByToken(oldToken).orElseThrow();

        verifyExpiration(token);

        var user = token.getUsuario();

        repository.delete(token);

        RefreshToken newToken = new RefreshToken();
        newToken.setUsuario(user);
        newToken.setToken(UUID.randomUUID().toString());
        newToken.setExpiration(Instant.now().plusMillis(refreshDuration));

        return repository.save(newToken);
    }
}
