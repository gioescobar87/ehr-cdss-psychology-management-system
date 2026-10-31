package com.clinica.psicologia.system.dto.request.catalog;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DiagnosticoReglaRequestDTO {

    @NotNull(message = "El diagnóstico es obligatorio")
    private Integer diagnosticoId;

    @NotNull(message = "El tipo de regla es obligatorio")
    private Integer tipoReglaId;

    @NotNull(message = "El valor de la regla es obligatorio")
    private Integer valorRegla;

    @NotNull(message = "El operador es obligatorio")
    private Integer operadorId;

    private String parametro;
}
