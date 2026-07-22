package com.clinica.psicologia.system.dto.response.clinical;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PruebaPsicologicaResponseDTO {

    private Integer id;

    private Integer pacienteId;

    private String pacienteNombre;

    private Integer sesionId;

    private Integer tipoPruebaId;

    private String tipoPrueba;

    private String nombre;

    private LocalDate fechaAplicacion;

    private String archivoAdjunto;
}