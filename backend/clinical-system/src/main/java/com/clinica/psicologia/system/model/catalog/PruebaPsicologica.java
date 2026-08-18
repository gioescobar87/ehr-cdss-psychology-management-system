package com.clinica.psicologia.system.model.catalog;

import com.clinica.psicologia.system.model.base.BaseCatalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "prueba_psicologica")
public class PruebaPsicologica extends BaseCatalog {

    @NotNull
    @Column(name = "objetivo_prueba")
    private String objetivoPrueba;

    @NotNull
    @Column(name = "instrucciones_aplicacion")
    private String instruccionesAplicacion;

    @Column(name = "consideraciones")
    private String consideraciones;
}