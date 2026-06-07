package com.clinica.psicologia.system.dto.response.security;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioResponseDTO {

    private Integer id;

    private String username;

    private String nombre;

    private String apellido;

    private String correo;

    private Integer estadoId;

    private String estado;

    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaModificacion;
}