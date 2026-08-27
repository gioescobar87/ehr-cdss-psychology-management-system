package com.clinica.psicologia.system.dto.response.clinical;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CancelacionResponseDTO {

    private Integer id;

    private Integer citaId;

    private Integer usuarioId;

    private String usuarioNombre;

    private String motivoCancelacion;

    private LocalDateTime fechaCancelacion;

    private Boolean solicitudPaciente;

}