package com.clinica.psicologia.system.dto.request.patient;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AsignarPacienteRequestDTO {

    @NotNull
    private Integer psicologoId;

    private String motivoAsignacion;
}