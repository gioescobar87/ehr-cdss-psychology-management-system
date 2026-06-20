package com.clinica.psicologia.system.model.catalog;

import com.clinica.psicologia.system.model.base.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "parentesco")
public class Parentesco extends BaseEntity {
    private String nombre;

    @ManyToOne(optional = false)
    @JoinColumn(name = "estado_id")
    private Estado estado;
}
