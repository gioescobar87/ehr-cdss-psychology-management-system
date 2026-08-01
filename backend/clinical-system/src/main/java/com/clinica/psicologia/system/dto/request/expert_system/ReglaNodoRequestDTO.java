package com.clinica.psicologia.system.dto.request.expert_system;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReglaNodoRequestDTO {

    @NotNull(message = "El nodo origen es obligatorio")
    private Integer nodoOrigenId;

    @NotNull(message = "El nodo destino es obligatorio")
    private Integer nodoDestinoId;

    @NotNull(message = "El criterio clínico es obligatorio")
    private Integer criterioClinicoId;

    @NotNull(message = "El estado es obligatorio")
    private Integer estadoId;
}