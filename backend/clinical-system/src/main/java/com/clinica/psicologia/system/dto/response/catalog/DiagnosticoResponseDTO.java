package com.clinica.psicologia.system.dto.response.catalog;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DiagnosticoResponseDTO {

    private Integer id;

    private String nombre;

    private String codigoDsm;

    private String descripcion;

    private Integer categoriaDiagnosticaId;

    private String categoriaDiagnostica;

    private Integer estadoId;

    private String estado;
}