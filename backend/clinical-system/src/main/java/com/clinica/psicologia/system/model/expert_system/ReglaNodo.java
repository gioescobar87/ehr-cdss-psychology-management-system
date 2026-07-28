package com.clinica.psicologia.system.model.expert_system;

import java.math.BigDecimal;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.Estado;

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
@Table(name = "regla_nodo")
public class ReglaNodo extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "nodo_origen_id", nullable = false)
    private NodoArbol nodoOrigen;

    @ManyToOne
    @JoinColumn(name = "nodo_destino_id", nullable = false)
    private NodoArbol nodoDestino;

    @Column(name = "campo_evaluado", nullable = false, length = 200)
    private String campoEvaluado;

    @Column(nullable = false, length = 50)
    private String operador;

    @Column(name = "valor_comparacion", length = 200)
    private String valorComparacion;

    @Column(precision = 5, scale = 2)
    private BigDecimal ponderacion;

    @ManyToOne
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;
}
