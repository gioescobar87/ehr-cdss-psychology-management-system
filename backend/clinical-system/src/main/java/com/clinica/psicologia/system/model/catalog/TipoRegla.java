package com.clinica.psicologia.system.model.catalog;

import com.clinica.psicologia.system.model.base.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tipo_regla")
public class TipoRegla extends BaseEntity {

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "descripcion", nullable = false, length = 100)
    private String descripcion;
}
