package com.clinica.psicologia.system.dto.response.patient;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PacienteAsignacionResponseDTO {

    private Integer id;

    private Integer pacienteId;
    private String pacienteNombre;

    private Integer psicologoId;
    private String psicologoNombre;

    private Integer usuarioCambioId;
    private String usuarioCambioNombre;

    private LocalDateTime fechaAsignacion;
    private LocalDateTime fechaFin;

    private String motivoAsignacion;
    private String justificacionReasignacion;
}