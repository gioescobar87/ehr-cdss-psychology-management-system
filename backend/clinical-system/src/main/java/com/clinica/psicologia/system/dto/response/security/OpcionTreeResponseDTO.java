package com.clinica.psicologia.system.dto.response.security;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OpcionTreeResponseDTO {

    private Integer id;

    private String nombre;

    private String rutaFrontend;

    private String icono;

    private Integer orden;

    private List<OpcionTreeResponseDTO> children =
            new ArrayList<>();
}