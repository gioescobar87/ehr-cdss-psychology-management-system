package com.clinica.psicologia.system.dto.request.clinical;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ObjetivoTerapiaRequestDTO {

    @NotNull(message = "Treatment plan is required.")
    private Integer planTratamientoId;

    @NotBlank(message = "Description is required.")
    @Size(max = 5000, message = "Description cannot exceed 5000 characters.")
    private String descripcion;

    @NotNull(message = "Start date is required.")
    private LocalDate fechaInicio;

    private LocalDate fechaMeta;

    @NotNull(message = "State is required.")
    private Integer estadoId;

}