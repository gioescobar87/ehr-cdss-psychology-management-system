package com.clinica.psicologia.system.mapper.patient;

import java.time.LocalDate;
import java.time.Period;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.patient.PacienteRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteResponseDTO;
import com.clinica.psicologia.system.model.patient.Paciente;

@Component
public class PacienteMapper {

    public Paciente toEntity(PacienteRequestDTO dto) {

        Paciente paciente = new Paciente();

        paciente.setNombre(dto.nombre());
        paciente.setApellido(dto.apellido());
        paciente.setFechaNacimiento(dto.fechaNacimiento());
        paciente.setSexo(dto.sexo());
        paciente.setOcupacion(dto.ocupacion());

        return paciente;
    }

    public PacienteResponseDTO toResponse(Paciente paciente) {
        int edad = Period.between(
                paciente.getFechaNacimiento(),
                LocalDate.now()
        ).getYears();

        return new PacienteResponseDTO(
                paciente.getId(),
                paciente.getNombre() + " " + paciente.getApellido(),
                paciente.getSexo(),
                edad
        );
    }

    public void updateEntityFromDto(PacienteRequestDTO dto, Paciente paciente) {
        paciente.setNombre(dto.nombre());
        paciente.setApellido(dto.apellido());
        paciente.setFechaNacimiento(dto.fechaNacimiento());
        paciente.setSexo(dto.sexo());
        paciente.setOcupacion(dto.ocupacion());
    }
}