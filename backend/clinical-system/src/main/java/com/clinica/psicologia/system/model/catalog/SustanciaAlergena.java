package com.clinica.psicologia.system.model.catalog;

import com.clinica.psicologia.system.model.base.BaseCatalog;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sustancia_alergena")
public class SustanciaAlergena extends BaseCatalog {

    @ManyToOne
    @JoinColumn(name = "tipo_sustancia_alergena_id", nullable = false)
    private TipoSustanciaAlergena tipoSustanciaAlergena;
}