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
@Table(name = "diagnostico_regla")
public class DiagnosticoRegla extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diagnostico_id", nullable = false)
    private Diagnostico diagnostico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_regla_id", nullable = false)
    private TipoRegla tipoRegla;

    @Column(name = "valor_regla", nullable = false)
    private Integer valorRegla;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operador_id", nullable = false)
    private Operador operador;

    @Column(name = "parametro")
    private String parametro;
}
