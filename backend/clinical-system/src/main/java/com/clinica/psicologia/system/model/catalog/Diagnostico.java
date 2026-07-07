package com.clinica.psicologia.system.model.catalog;

import com.clinica.psicologia.system.model.base.BaseCatalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "diagnostico")
public class Diagnostico extends BaseCatalog {

    @ManyToOne
    @JoinColumn(name = "categoria_diagnostica_id", nullable = false)
    private CategoriaDiagnostica categoriaDiagnostica;

    @Column(name = "codigo_dsm", length = 50)
    private String codigoDsm;
}