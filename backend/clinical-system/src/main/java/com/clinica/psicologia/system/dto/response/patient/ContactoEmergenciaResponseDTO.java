package com.clinica.psicologia.system.dto.response.patient;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactoEmergenciaResponseDTO {
    private Integer id;

    private Integer pacienteId;

    private String pacienteNombre;

    private String nombre;

    private Integer parentescoId;

    private String parentesco;

    private String telefono;

    private String direccion;

    private String observaciones;

    private Integer estadoId;

    private String estado;
}
