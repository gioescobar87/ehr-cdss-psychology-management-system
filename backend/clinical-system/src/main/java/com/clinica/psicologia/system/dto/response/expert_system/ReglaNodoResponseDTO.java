package com.clinica.psicologia.system.dto.response.expert_system;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReglaNodoResponseDTO {

    private Integer id;

    private Integer nodoOrigenId;

    private String nodoOrigenDescripcion;

    private Integer nodoDestinoId;

    private String nodoDestinoDescripcion;

    private String campoEvaluado;

    private String operador;

    private String valorComparacion;

    private BigDecimal ponderacion;

    private Integer estadoId;

    private String estado;
}