package com.clinica.psicologia.system.dto.response.expert_system;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NodoArbolResponseDTO {

    private Integer id;

    private Integer arbolDiagnosticoId;

    private String arbolDiagnostico;

    private Integer nodoPadreId;

    private Integer diagnosticoId;

    private String diagnostico;

    private String descripcion;

    private Integer orden;

    private Integer estadoId;

    private String estado;
}