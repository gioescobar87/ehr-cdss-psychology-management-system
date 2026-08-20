package com.clinica.psicologia.system.dto.request.patient;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public record PacienteRequestDTO(

    @NotBlank(message = "El nombre es obligatorio")
    String nombre,

    @NotBlank(message = "El apellido es obligatorio")
    String apellido,

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser anterior a hoy")
    LocalDate fechaNacimiento,

    @NotBlank(message = "El sexo es obligatorio")
    @Size(min = 1, max = 1, message = "El sexo debe tener un solo carácter")
    String sexo,

    String ocupacion,

    Integer estadoCivilId,

    Integer nivelEscolaridadId
) {
}