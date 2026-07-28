package com.clinica.psicologia.system.model.expert_system;

import java.time.LocalDateTime;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.CategoriaDiagnostica;
import com.clinica.psicologia.system.model.catalog.Estado;

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
@Table(
        name = "arbol_diagnostico",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "codigo_arbol",
                                "version"
                        }
                )
        }
)
public class ArbolDiagnostico extends BaseEntity {

    @Column(name = "codigo_arbol",
            nullable = false,
            length = 100)
    private String codigoArbol;

    @Column(nullable = false)
    private Integer version;

    @Column(nullable = false,
            length = 200)
    private String nombre;

    @ManyToOne
    @JoinColumn(
            name = "categoria_diagnostica_id",
            nullable = false)
    private CategoriaDiagnostica categoriaDiagnostica;

    @ManyToOne
    @JoinColumn(
            name = "estado_id",
            nullable = false)
    private Estado estado;

    @Column(
            name = "fecha_creacion",
            nullable = false)
    private LocalDateTime fechaCreacion;
}