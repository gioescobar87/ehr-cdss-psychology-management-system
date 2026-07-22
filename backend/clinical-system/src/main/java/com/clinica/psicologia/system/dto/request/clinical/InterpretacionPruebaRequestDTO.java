package com.clinica.psicologia.system.dto.request.clinical;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterpretacionPruebaRequestDTO {

    @NotNull(message = "La prueba psicológica es obligatoria.")
    private Integer pruebaPsicologicaId;

    @NotBlank(message = "La interpretación es obligatoria.")
    private String descripcionInterpretacion;

}