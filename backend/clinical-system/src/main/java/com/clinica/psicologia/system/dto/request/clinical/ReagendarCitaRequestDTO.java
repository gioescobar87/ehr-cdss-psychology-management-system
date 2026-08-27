package com.clinica.psicologia.system.dto.request.clinical;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReagendarCitaRequestDTO {

    @NotBlank(message = "El motivo de la reprogramación es obligatorio")
    private String motivoCancelacion;

    @NotNull(message = "Necesita indicar quién solicita la reprogramación")
    private Boolean solicitudPaciente;

    @NotNull(message = "La nueva fecha y hora son obligatorias")
    private LocalDateTime nuevaFechaHoraInicio;
}
