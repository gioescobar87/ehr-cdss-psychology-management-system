package com.clinica.psicologia.system.dto.response.catalog;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PruebaPsicologicaResponseDTO {

    private Integer id;

    private String nombre;

    private String descripcion;

    private String objetivoPrueba;

    private String instruccionesAplicacion;

    private String consideraciones;

    private Integer estadoId;

    private String estado;
}