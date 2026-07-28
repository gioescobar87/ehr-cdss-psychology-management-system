package com.clinica.psicologia.system.dto.request.expert_system;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReglaNodoRequestDTO {

    @NotNull(message = "Source node is required.")
    private Integer nodoOrigenId;

    @NotNull(message = "Destination node is required.")
    private Integer nodoDestinoId;

    @NotBlank(message = "Evaluated field is required.")
    @Size(max = 200)
    private String campoEvaluado;

    @NotBlank(message = "Operator is required.")
    @Size(max = 50)
    private String operador;

    @Size(max = 200)
    private String valorComparacion;

    private BigDecimal ponderacion;

    @NotNull(message = "State is required.")
    private Integer estadoId;
}