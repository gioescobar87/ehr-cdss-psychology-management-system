package com.clinica.psicologia.system.dto.response.security;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NavigationOptionResponseDTO {

    private Integer id;

    private Integer parentId;

    private String nombre;

    private String rutaFrontend;

    private String componente;

    private String icono;

    private Integer orden;

    private List<NavigationOptionResponseDTO> children = new ArrayList<>();
}