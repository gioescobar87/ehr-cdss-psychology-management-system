package com.clinica.psicologia.system.dto.response.expert_system;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NodoArbolResponseDTO {
    private Integer id;;

    private Integer arbolDiagnosticoId;

    private String ArbolDiagnosticoNombre;

    private Integer nodoPadreId;

    private String tipoNodo;

    private String descripcion;

    private Boolean esTerminal;

    private Integer orden;

    private Integer estadoId;

    private String estado;
}
