package com.clinica.psicologia.system.dto.response.clinical;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterpretacionPruebaResponseDTO {

    private Integer id;

    private Integer pruebaPsicologicaId;

    private String nombrePrueba;

    private Integer pacienteId;

    private String pacienteNombre;

    private Integer usuarioId;

    private String psicologo;

    private String descripcionInterpretacion;

    private LocalDateTime fechaRegistro;

}