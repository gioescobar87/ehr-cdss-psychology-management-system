package com.clinica.psicologia.system.dto.request.clinical;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeguimientoObjetivoRequestDTO {

    @NotNull(message = "Therapy objective is required.")
    private Integer objetivoTerapiaId;

    @NotNull(message = "Session is required.")
    private Integer sesionId;

    @NotBlank(message = "Progress description is required.")
    @Size(max = 5000, message = "Progress description cannot exceed 5000 characters.")
    private String descripcionAvance;

}