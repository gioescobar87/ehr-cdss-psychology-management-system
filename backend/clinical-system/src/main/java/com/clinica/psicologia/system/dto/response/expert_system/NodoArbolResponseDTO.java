package com.clinica.psicologia.system.dto.response.expert_system;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NodoArbolResponseDTO {

    private Integer id;

    private Integer arbolDiagnosticoId;
    private String arbolDiagnostico;

    private Integer criterioClinicoId;
    private String criterioClinico;

    private Integer nodoPresenteId;

    private Integer nodoAusenteId;

    private Integer diagnosticoId;
    private String diagnostico;

    private String descripcion;

    private Integer estadoId;
    private String estado;
}