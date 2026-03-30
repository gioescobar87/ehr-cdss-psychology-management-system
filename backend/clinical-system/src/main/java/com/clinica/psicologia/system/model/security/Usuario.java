package com.clinica.psicologia.system.model.security;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.Estado;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "usuario",
       uniqueConstraints = {
           @UniqueConstraint(name = "uq_usuario_username", columnNames = "username"),
           @UniqueConstraint(name = "uq_usuario_correo", columnNames = "correo")
       })
public class Usuario extends BaseEntity{

    @Column(nullable = false, length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 150)
    private String apellido;

    @Column(nullable = false, length = 200)
    private String correo;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private java.time.LocalDateTime fechaCreacion;

    @Column(name = "fecha_modificacion")
    private java.time.LocalDateTime fechaModificacion;

    @ManyToOne
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;
}