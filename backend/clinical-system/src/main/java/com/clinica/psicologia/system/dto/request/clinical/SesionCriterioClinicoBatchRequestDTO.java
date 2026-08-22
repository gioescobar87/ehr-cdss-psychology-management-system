package com.clinica.psicologia.system.dto.request.clinical;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SesionCriterioClinicoBatchRequestDTO {

    @NotNull(message = "La sesión es obligatoria")
    private Integer sesionId;

    @NotEmpty(message = "Debe seleccionar al menos un criterio clínico")
    private List<@NotNull(message = "El criterio clínico es obligatorio") Integer> criterioClinicoIds;
}