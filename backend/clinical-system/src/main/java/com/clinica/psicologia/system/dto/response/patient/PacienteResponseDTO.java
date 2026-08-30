package com.clinica.psicologia.system.dto.response.patient;

public record PacienteResponseDTO(
    Integer id,
    String nombre,
    String apellido,
    String dpi,
    java.time.LocalDate fechaNacimiento,
    String sexo,
    String direccion,
    String telefono,
    String ocupacion,
    java.time.LocalDateTime fechaRegistro,
    Integer estadoCivilId,
    String estadoCivil,
    Integer nivelEscolaridadId,
    String nivelEscolaridad,
    Integer estadoId,
    String estado,
    Integer edad,
    String refiere,
    java.time.LocalDateTime fechaInicio,
    String motivoInicio,
    java.time.LocalDateTime fechaCierre,
    String motivoCierre
) {
    
}
