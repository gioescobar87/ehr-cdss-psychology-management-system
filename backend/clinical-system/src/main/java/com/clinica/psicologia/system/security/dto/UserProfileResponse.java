package com.clinica.psicologia.system.security.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileResponse {

    private Integer id;
    private String username;
    private String nombre;
    private String apellido;
    private String correo;
    private List<String> roles;

}