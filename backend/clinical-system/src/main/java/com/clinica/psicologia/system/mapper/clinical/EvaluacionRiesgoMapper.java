package com.clinica.psicologia.system.mapper.clinical;

import com.clinica.psicologia.system.dto.request.clinical.EvaluacionRiesgoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.EvaluacionRiesgoResponseDTO;
import com.clinica.psicologia.system.model.clinical.EvaluacionRiesgo;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EvaluacionRiesgoMapper {

    public EvaluacionRiesgoResponseDTO toResponseDTO(EvaluacionRiesgo entity) {

        EvaluacionRiesgoResponseDTO dto = new EvaluacionRiesgoResponseDTO();

        dto.setId(entity.getId());

        dto.setPacienteId(entity.getPaciente().getId());
        dto.setPacienteNombre(entity.getPaciente().getNombre() + " " + entity.getPaciente().getApellido());

        dto.setSesionId(entity.getSesion().getId());

        dto.setTipoRiesgoId(entity.getTipoRiesgo().getId());
        dto.setTipoRiesgo(entity.getTipoRiesgo().getNombre());

        dto.setNivelRiesgoId(entity.getNivelRiesgo().getId());
        dto.setNivelRiesgo(entity.getNivelRiesgo().getNombre());

        dto.setObservaciones(entity.getObservaciones());
        dto.setFecha(entity.getFecha());

        return dto;
    }

    public List<EvaluacionRiesgoResponseDTO> toResponseDTOList(List<EvaluacionRiesgo> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(EvaluacionRiesgo entity, EvaluacionRiesgoRequestDTO dto) {
        entity.setObservaciones(dto.getObservaciones());
        entity.setFecha(dto.getFecha());
    }
}