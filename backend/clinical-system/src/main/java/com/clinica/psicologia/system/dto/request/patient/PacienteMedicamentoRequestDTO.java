package com.clinica.psicologia.system.dto.request.patient;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PacienteMedicamentoRequestDTO {

    @NotNull
    private Integer pacienteId;

    @NotNull
    private Integer medicamentoId;

    private String dosis;

    private String frecuencia;

    private String viaAdministracion;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private String prescritoPor;
}