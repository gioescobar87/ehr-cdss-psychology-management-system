package com.clinica.psicologia.system.model.security;

import com.clinica.psicologia.system.model.base.BaseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "rol_permiso")
public class RolPermiso extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;

    @ManyToOne
    @JoinColumn(name = "permiso_id")
    private Permiso permiso;

}