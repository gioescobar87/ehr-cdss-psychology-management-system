package com.clinica.psicologia.system.model.catalog;

import com.clinica.psicologia.system.model.base.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "estado")
@Getter
@Setter
public class Estado extends BaseEntity {

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    private String descripcion;
}
