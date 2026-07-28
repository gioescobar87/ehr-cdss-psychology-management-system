package com.clinica.psicologia.system.dto.response.expert_system;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArbolDiagnosticoResponseDTO {

    private Integer id;

    private String codigoArbol;

    private Integer version;

    private String nombre;

    private Integer categoriaDiagnosticaId;

    private String categoriaDiagnostica;

    private Integer estadoId;

    private String estado;

    private LocalDateTime fechaCreacion;
}