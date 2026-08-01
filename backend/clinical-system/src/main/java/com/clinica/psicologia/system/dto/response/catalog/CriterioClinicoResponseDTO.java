package com.clinica.psicologia.system.dto.response.catalog;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CriterioClinicoResponseDTO {

    private Integer id;

    private String nombre;

    private String codigo;

    private String descripcion;

    private Integer categoriaCriterioClinicoId;

    private String categoriaCriterioClinico;

    private Integer estadoId;

    private String estado;
}