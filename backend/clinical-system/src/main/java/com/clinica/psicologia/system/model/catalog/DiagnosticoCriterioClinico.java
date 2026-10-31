package com.clinica.psicologia.system.model.catalog;

import com.clinica.psicologia.system.model.base.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "diagnostico_criterio_clinico")
public class DiagnosticoCriterioClinico extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diagnostico_id", nullable = false)
    private Diagnostico diagnostico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criterio_clinico_id", nullable = false)
    private CriterioClinico criterioClinico;

    @Column(name = "referencia_regla", length = 1)
    private String referenciaRegla;
}
