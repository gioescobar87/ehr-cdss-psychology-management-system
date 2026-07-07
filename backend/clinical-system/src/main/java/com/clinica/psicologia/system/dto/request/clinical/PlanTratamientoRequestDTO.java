package com.clinica.psicologia.system.dto.request.clinical;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlanTratamientoRequestDTO {

    @NotNull(message = "Patient diagnosis is required.")
    private Integer pacienteDiagnosticoId;

    @Size(max = 5000, message = "General description cannot exceed 5000 characters.")
    private String descripcionGeneral;

    @NotNull(message = "Start date is required.")
    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    @NotNull(message = "State is required.")
    private Integer estadoId;
}