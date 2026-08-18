package com.clinica.psicologia.system.dto.request.catalog;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PruebaPsicologicaRequestDTO {

    @NotBlank(message = "El nombre es obligatorio.")
    private String nombre;

    private String descripcion;

    @NotBlank(message = "El objetivo de la prueba es obligatorio.")
    private String objetivoPrueba;

    @NotBlank(message = "Las instrucciones de aplicación son obligatorio.")
    private String instruccionesAplicacion;

    private String consideraciones;

}