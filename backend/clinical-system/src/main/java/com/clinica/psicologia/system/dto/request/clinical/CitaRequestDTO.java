package com.clinica.psicologia.system.dto.request.clinical;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CitaRequestDTO {

    @NotNull(message = "El paciente es obligatorio")
    private Integer pacienteId;

    @NotNull(message = "El psicólogo es obligatorio")
    private Integer usuarioId;

    @NotNull(message = "La fecha y hora de inicio es obligatoria")
    private LocalDateTime fechaHoraInicio;

    @NotNull(message = "La fecha y hora de finalización es obligatoria")
    private LocalDateTime fechaHoraFin;

    private String motivo;

    private String observaciones;

    @NotNull(message = "El estado es obligatorio")
    private Integer estadoId;

}