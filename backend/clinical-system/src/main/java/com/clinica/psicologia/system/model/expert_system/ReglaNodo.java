package com.clinica.psicologia.system.model.expert_system;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.CriterioClinico;
import com.clinica.psicologia.system.model.catalog.Estado;

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

    @ManyToOne
    @JoinColumn(name = "criterio_clinico_id", nullable = false)
    private CriterioClinico criterioClinico;

    @ManyToOne
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;
}