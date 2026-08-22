package com.clinica.psicologia.system.dto.request.clinical;

import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.clinical.Sesion;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PacienteDiagnosticoRequestDTO {

    @NotNull(message = "El diagnóstico es obligatorio")
    private Integer diagnosticoId;

    @NotNull(message = "La sesión es obligatoria")
    private Integer sesionId;

    @NotNull(message = "Debe indicar si corresponde a un diagnóstico inicial")
    private Boolean diagnosticoInicial;
}