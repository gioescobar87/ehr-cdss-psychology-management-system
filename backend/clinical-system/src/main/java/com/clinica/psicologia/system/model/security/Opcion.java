package com.clinica.psicologia.system.model.security;

import com.clinica.psicologia.system.model.base.BaseCatalog;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "opcion")
@Getter
@Setter
public class Opcion extends BaseCatalog {
    
    private String rutaFrontend;

    private String componente;

    private String icono;

    private Integer orden;

    private Boolean visibleMenu;

    private Boolean requiereAutenticacion;

    private Boolean esMenuPrincipal;

    @ManyToOne
    @JoinColumn(name = "modulo_id")
    private Modulo modulo;

    @ManyToOne
    @JoinColumn(name = "opcion_padre_id")
    private Opcion opcionPadre;
}
