package com.clinica.psicologia.system.dto.request.patient;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PacienteRequestDTO(
    @NotBlank(message = "El nombre es obligatorio")
    String nombre,

    @NotBlank(message = "El apellido es obligatorio")
    String apellido,

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    LocalDate fechaNacimiento,

    @NotBlank(message = "El sexo es obligatorio")
    String sexo,
    
    String ocupacion,
    Integer estadoCivilId,
    Integer nivelEscolaridadId
) {
    
}
