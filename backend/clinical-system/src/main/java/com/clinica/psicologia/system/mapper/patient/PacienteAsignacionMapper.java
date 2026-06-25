package com.clinica.psicologia.system.mapper.patient;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.response.patient.PacienteAsignacionResponseDTO;
import com.clinica.psicologia.system.model.patient.PacienteAsignacion;

@Component
public class PacienteAsignacionMapper {

    public PacienteAsignacionResponseDTO toResponse(PacienteAsignacion entity) {

        PacienteAsignacionResponseDTO dto = new PacienteAsignacionResponseDTO();

        dto.setId(entity.getId());

        dto.setPacienteId(entity.getPaciente().getId());
        dto.setPacienteNombre(entity.getPaciente().getNombre() + " " + entity.getPaciente().getApellido());

        dto.setPsicologoId(entity.getPsicologo().getId());
        dto.setPsicologoNombre(entity.getPsicologo().getNombre() + " " + entity.getPsicologo().getApellido());

        if (entity.getUsuarioCambio() != null) {

            dto.setUsuarioCambioId(entity.getUsuarioCambio().getId());

            dto.setUsuarioCambioNombre(
                    entity.getUsuarioCambio().getNombre() + " " + entity.getUsuarioCambio().getApellido());
        }

        dto.setFechaAsignacion(entity.getFechaAsignacion());
        dto.setFechaFin(entity.getFechaFin());

        dto.setMotivoAsignacion(entity.getMotivoAsignacion());
        dto.setJustificacionReasignacion(entity.getJustificacionReasignacion());

        return dto;
    }

    public List<PacienteAsignacionResponseDTO> toResponseList(List<PacienteAsignacion> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }
}