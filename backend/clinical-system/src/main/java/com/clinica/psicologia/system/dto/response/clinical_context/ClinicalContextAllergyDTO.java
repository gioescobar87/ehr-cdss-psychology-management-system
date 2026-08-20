package com.clinica.psicologia.system.dto.response.clinical_context;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClinicalContextAllergyDTO {

    private Integer id;

    private String sustanciaAlergena;

    private String tipoReaccion;

    private String nivelSeveridad;

    private String observaciones;
}