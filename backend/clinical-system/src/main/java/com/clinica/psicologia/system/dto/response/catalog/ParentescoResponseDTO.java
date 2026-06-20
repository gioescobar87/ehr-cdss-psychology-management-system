package com.clinica.psicologia.system.dto.response.catalog;

import lombok.Setter;
import lombok.Getter;

@Getter
@Setter
public class ParentescoResponseDTO {
    private Integer id;

    private String nombre;

    private Integer estadoId;

    private String estado;
}
