package com.clinica.psicologia.system.dto.response.clinical;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResultadoPruebaResponseDTO {

    private Integer id;

    private Integer pruebaPsicologicaId;

    private String nombrePrueba;

    private Integer pacienteId;

    private String pacienteNombre;

    private String parametro;

    private String valor;

    private String unidadMedida;

    private String observaciones;

}