package com.clinica.psicologia.system.model.security;

import java.time.LocalDateTime;

import com.clinica.psicologia.system.model.base.BaseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "password_reset_token")
public class PasswordResetToken extends BaseEntity {

    @Column(nullable = false, unique = true, length = 255)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_expiracion", nullable = false)
    private LocalDateTime fechaExpiracion;

    @Column(nullable = false)
    private boolean usado = false;
}