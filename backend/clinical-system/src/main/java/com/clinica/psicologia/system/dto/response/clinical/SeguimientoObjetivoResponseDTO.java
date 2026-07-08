package com.clinica.psicologia.system.dto.response.clinical;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeguimientoObjetivoResponseDTO {

    private Integer id;

    private Integer objetivoTerapiaId;

    private Integer planTratamientoId;

    private Integer pacienteDiagnosticoId;

    private Integer sesionId;

    private Integer pacienteId;

    private String pacienteNombre;

    private Integer usuarioId;

    private String usuario;

    private String descripcionAvance;

    private LocalDateTime fechaRegistro;

}