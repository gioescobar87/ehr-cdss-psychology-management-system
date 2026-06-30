package com.clinica.psicologia.system.dto.request.clinical;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SesionRequestDTO {
    @NotNull(message = "El paciente es obligatorio.")
    private Integer pacienteId;

    @NotNull(message = "El psicólogo es obligatorio.")
    private Integer usuarioId;

    @NotNull(message = "El tipo de sesión es obligatorio.")
    private Integer tipoSesionId;

    @NotNull(message = "La fecha de la sesión es obligatoria.")
    private LocalDateTime fechaSesion;

    private String observacionesGenerales;

    @NotNull(message = "El estado es obligatorio.")
    private Integer estadoId;
}
