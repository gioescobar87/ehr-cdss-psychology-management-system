package com.clinica.psicologia.system.dto.response.clinical;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SesionResponseDTO {
    private Integer id;

    private Integer pacienteId;
    private String pacienteNombre;

    private Integer usuarioId;
    private String usuarioNombre;

    private Integer tipoSesionId;
    private String tipoSesion;

    private LocalDateTime fechaSesion;

    private String observacionesGenerales;

    private Integer estadoId;
    private String estado;

    private Integer citaId;
}
