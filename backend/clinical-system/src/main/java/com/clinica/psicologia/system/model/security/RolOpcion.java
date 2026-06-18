package com.clinica.psicologia.system.model.security;

import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.base.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "rol_opcion")
@Getter
@Setter
public class RolOpcion extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;

    @ManyToOne
    @JoinColumn(name = "opcion_id")
    private Opcion opcion;

    private Boolean visible;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private Estado estado;
}
