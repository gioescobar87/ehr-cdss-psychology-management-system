package com.clinica.psicologia.system.dto.response.clinical;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotaSesionResponseDTO {
    private Integer id;

    private Integer sesionId;

    private Integer usuarioId;

    private String usuarioNombre;

    private String contenido;

    private String tipoNota;

    private LocalDateTime fechaRegistro;
}
