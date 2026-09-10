package com.clinica.psicologia.system.dto.response.clinical;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CitaResponseDTO {

    private Integer id;

    private Integer pacienteId;
    private String pacienteNombre;

    private Integer usuarioId;
    private String usuarioNombre;

    private LocalDateTime fechaHoraInicio;
    private LocalDateTime fechaHoraFin;

    private String motivo;
    private String observaciones;

    private Integer estadoId;
    private String estado;

    private boolean tieneSesion;
    private Integer sesionId;

    private Integer cancelacionId;
    private String motivoCancelacion;
}