package com.clinica.psicologia.system.dto.request.patient;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReasignarPacienteRequestDTO {

    @NotNull
    private Integer nuevoPsicologoId;

    @NotBlank
    private String justificacionReasignacion;

    @NotNull
    private Integer usuarioCambioId;
}