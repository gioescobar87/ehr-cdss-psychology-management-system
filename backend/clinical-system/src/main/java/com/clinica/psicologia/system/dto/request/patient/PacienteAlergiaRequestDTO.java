package com.clinica.psicologia.system.dto.request.patient;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PacienteAlergiaRequestDTO {

    @NotNull
    private Integer pacienteId;

    @NotNull
    private Integer sustanciaAlergenaId;

    private Integer nivelSeveridadAlergiaId;

    private String tipoReaccion;

    private String observaciones;

    @NotNull
    private Integer estadoId;
}