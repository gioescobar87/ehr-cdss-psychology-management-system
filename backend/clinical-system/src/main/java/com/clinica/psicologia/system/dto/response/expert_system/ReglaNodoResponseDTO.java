package com.clinica.psicologia.system.dto.response.expert_system;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReglaNodoResponseDTO {

    private Integer id;

    private Integer nodoOrigenId;

    private Integer nodoDestinoId;

    private Integer criterioClinicoId;

    private String criterioClinico;

    private Integer estadoId;

    private String estado;
}