package com.clinica.psicologia.system.dto.response.catalog;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DiagnosticoReglaResponseDTO {

    private Integer id;

    private Integer diagnosticoId;

    private String diagnostico;

    private Integer tipoReglaId;

    private String tipoRegla;

    private Integer valorRegla;

    private Integer operadorId;

    private String operador;

    private String parametro;
}
