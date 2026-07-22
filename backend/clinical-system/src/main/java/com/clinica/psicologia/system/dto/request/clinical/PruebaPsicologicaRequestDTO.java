package com.clinica.psicologia.system.dto.request.clinical;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PruebaPsicologicaRequestDTO {

    @NotNull(message = "El paciente es obligatorio.")
    private Integer pacienteId;

    private Integer sesionId;

    @NotNull(message = "El tipo de prueba es obligatorio.")
    private Integer tipoPruebaId;

    @NotBlank(message = "El nombre de la prueba es obligatorio.")
    @Size(max = 200)
    private String nombre;

    private LocalDate fechaAplicacion;

    private String archivoAdjunto;
}