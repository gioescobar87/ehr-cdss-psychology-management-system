package com.clinica.psicologia.system.dto.response.clinical_context;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ClinicalContextSessionDTO {

    private Integer id;

    private LocalDateTime fechaSesion;

    private String tipoSesion;

    private String estado;

    private Integer citaId;

    private String motivoCita;
}