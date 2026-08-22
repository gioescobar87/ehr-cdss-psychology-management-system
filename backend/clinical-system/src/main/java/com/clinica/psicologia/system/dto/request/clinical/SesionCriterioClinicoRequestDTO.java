package com.clinica.psicologia.system.dto.request.clinical;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SesionCriterioClinicoRequestDTO {

    @NotNull(message = "La sesión es obligatoria")
    private Integer sesionId;

    @NotNull(message = "El criterio clínico es obligatorio")
    private Integer criterioClinicoId;

    @NotNull(message = "La presencia del criterio clínico es obligatoria")
    private Boolean presente;
}