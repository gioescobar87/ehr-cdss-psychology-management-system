package com.clinica.psicologia.system.model.expert_system;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.CriterioClinico;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "evaluacion_criterio_clinico", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "evaluacion_diagnostica_id",
                "criterio_clinico_id"
        })
})
public class EvaluacionCriterioClinico extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "evaluacion_diagnostica_id", nullable = false)
    private EvaluacionDiagnostica evaluacionDiagnostica;

    @ManyToOne
    @JoinColumn(name = "criterio_clinico_id", nullable = false)
    private CriterioClinico criterioClinico;

    @Column(columnDefinition = "TEXT")
    private String observaciones;
}