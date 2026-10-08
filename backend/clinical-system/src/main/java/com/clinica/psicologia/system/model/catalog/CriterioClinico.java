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
@Table(name = "criterio_clinico")
public class CriterioClinico extends BaseCatalog {

    @ManyToOne
    @JoinColumn(name = "categoria_criterio_clinico_id", nullable = false)
    private CategoriaCriterioClinico categoriaCriterioClinico;
}