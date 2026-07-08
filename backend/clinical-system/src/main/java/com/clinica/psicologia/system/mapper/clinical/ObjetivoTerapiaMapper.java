package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.clinical.ObjetivoTerapiaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.ObjetivoTerapiaResponseDTO;
import com.clinica.psicologia.system.model.clinical.ObjetivoTerapia;

@Component
public class ObjetivoTerapiaMapper {

    public ObjetivoTerapiaResponseDTO toResponseDTO(ObjetivoTerapia entity) {

        ObjetivoTerapiaResponseDTO dto = new ObjetivoTerapiaResponseDTO();

        dto.setId(entity.getId());

        dto.setPlanTratamientoId(entity.getPlanTratamiento().getId());

        dto.setPacienteDiagnosticoId(entity.getPlanTratamiento().getPacienteDiagnostico().getId());

        dto.setPacienteId(entity.getPlanTratamiento().getPacienteDiagnostico().getPaciente().getId());

        dto.setPacienteNombre(entity.getPlanTratamiento().getPacienteDiagnostico().getPaciente().getNombre() + " "
                + entity.getPlanTratamiento().getPacienteDiagnostico().getPaciente().getApellido());

        dto.setDescripcion(entity.getDescripcion());

        dto.setFechaInicio(entity.getFechaInicio());

        dto.setFechaMeta(entity.getFechaMeta());

        dto.setEstadoId(entity.getEstado().getId());

        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    public List<ObjetivoTerapiaResponseDTO> toResponseDTOList(List<ObjetivoTerapia> entities) {

        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(ObjetivoTerapia entity, ObjetivoTerapiaRequestDTO dto) {

        entity.setDescripcion(dto.getDescripcion());

        entity.setFechaInicio(dto.getFechaInicio());

        entity.setFechaMeta(dto.getFechaMeta());
    }

}