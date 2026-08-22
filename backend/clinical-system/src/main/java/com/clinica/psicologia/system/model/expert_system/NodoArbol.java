package com.clinica.psicologia.system.model.expert_system;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.CriterioClinico;
import com.clinica.psicologia.system.model.catalog.Diagnostico;
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
@Table(name = "nodo_arbol")
public class NodoArbol extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "arbol_diagnostico_id", nullable = false)
    private ArbolDiagnostico arbolDiagnostico;

    @ManyToOne
    @JoinColumn(name = "criterio_clinico_id")
    private CriterioClinico criterioClinico;

    @ManyToOne
    @JoinColumn(name = "criterio_presente_nodo_id")
    private NodoArbol nodoPresente;

    @ManyToOne
    @JoinColumn(name = "criterio_ausente_nodo_id")
    private NodoArbol nodoAusente;

    @ManyToOne
    @JoinColumn(name = "diagnostico_id")
    private Diagnostico diagnostico;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;

    @JoinColumn(name = "nodo_raiz", nullable = false)
    private Boolean nodoRaiz;
}