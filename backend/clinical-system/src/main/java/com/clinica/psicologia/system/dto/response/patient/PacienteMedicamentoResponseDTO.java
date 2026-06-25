package com.clinica.psicologia.system.dto.response.patient;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PacienteMedicamentoResponseDTO {

    private Integer id;

    private Integer pacienteId;

    private String pacienteNombre;

    private Integer medicamentoId;

    private String medicamento;

    private String dosis;

    private String frecuencia;

    private String viaAdministracion;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private String prescritoPor;

    private Integer estadoId;

    private String estado;
}