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
@Table(name = "operador")
public class Operador extends BaseEntity {

    @Column(name = "nombre", nullable = false, length = 2)
    private String nombre;

    @Column(name = "descripcion", nullable = false, length = 15)
    private String descripcion;
}
