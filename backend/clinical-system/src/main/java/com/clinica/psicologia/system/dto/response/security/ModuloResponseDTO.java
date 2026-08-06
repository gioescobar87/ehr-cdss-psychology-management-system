package com.clinica.psicologia.system.dto.response.security;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModuloResponseDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Integer estadoId;
    private String estado;
    private Integer moduloId;
    private String modulo;

    private String icono;
    private Integer orden;
}
