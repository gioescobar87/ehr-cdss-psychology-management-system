package com.clinica.psicologia.system.dto.request.catalog;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DiagnosticoCriterioClinicoRequestDTO {

    @NotNull(message = "El diagnóstico es obligatorio")
    private Integer diagnosticoId;

    @NotNull(message = "El criterio clínico es obligatorio")
    private Integer criterioClinicoId;

    @Size(max = 1, message = "La referencia de regla no puede exceder 1 carácter")
    private String referenciaRegla;
}
