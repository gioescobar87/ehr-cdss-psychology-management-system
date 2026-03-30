package com.clinica.psicologia.system.model.base;

import com.clinica.psicologia.system.model.catalog.Estado;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseCatalog extends BaseEntity {

    private String nombre;

    private String descripcion;

    @ManyToOne(optional = false)
    @JoinColumn(name = "estado_id")
    private Estado estado;
}
