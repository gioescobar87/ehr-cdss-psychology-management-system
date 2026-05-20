package com.clinica.psicologia.system.dto.request.patient;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PacienteRequestDTO(
    @NotBlank
    String nombre,

    @NotBlank
    String apellido,

    @NotNull
    LocalDate fechaNacimiento,

    @NotBlank
    String sexo,
    
    String ocupacion,
    Long estadoCivilId,
    Long nivelEscolaridadId
) {
    
}
