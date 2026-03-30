package com.clinica.psicologia.system.model.security;

import com.clinica.psicologia.system.model.base.BaseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "usuario_rol")
public class UsuarioRol extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;
}