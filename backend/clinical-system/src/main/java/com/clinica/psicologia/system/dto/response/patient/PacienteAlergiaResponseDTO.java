package com.clinica.psicologia.system.dto.response.patient;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PacienteAlergiaResponseDTO {

    private Integer id;

    private Integer pacienteId;

    private String pacienteNombre;

    private Integer sustanciaAlergenaId;

    private String sustanciaAlergena;

    private Integer nivelSeveridadAlergiaId;

    private String nivelSeveridadAlergia;

    private String tipoReaccion;

    private String observaciones;

    private Integer estadoId;

    private String estado;
}