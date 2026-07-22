package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.clinical.InterpretacionPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.InterpretacionPruebaResponseDTO;
import com.clinica.psicologia.system.model.clinical.InterpretacionPrueba;

@Component
public class InterpretacionPruebaMapper {

    public InterpretacionPruebaResponseDTO toResponseDTO(InterpretacionPrueba entity) {

        InterpretacionPruebaResponseDTO dto = new InterpretacionPruebaResponseDTO();

        dto.setId(entity.getId());

        dto.setPruebaPsicologicaId(entity.getPruebaPsicologica().getId());
        dto.setNombrePrueba(entity.getPruebaPsicologica().getNombre());

        dto.setPacienteId(entity.getPruebaPsicologica().getPaciente().getId());
        dto.setPacienteNombre(entity.getPruebaPsicologica().getPaciente().getNombre() + " "
                + entity.getPruebaPsicologica().getPaciente().getApellido());

        dto.setUsuarioId(entity.getUsuario().getId());
        dto.setPsicologo(entity.getUsuario().getNombre() + " " + entity.getUsuario().getApellido());

        dto.setDescripcionInterpretacion(entity.getDescripcionInterpretacion());
        dto.setFechaRegistro(entity.getFechaRegistro());

        return dto;
    }

    public List<InterpretacionPruebaResponseDTO> toResponseDTOList(List<InterpretacionPrueba> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(InterpretacionPrueba entity, InterpretacionPruebaRequestDTO dto) {
        entity.setDescripcionInterpretacion(dto.getDescripcionInterpretacion());
    }

}