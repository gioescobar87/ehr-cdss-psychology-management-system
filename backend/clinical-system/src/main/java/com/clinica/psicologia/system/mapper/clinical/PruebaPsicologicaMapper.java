package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.clinical.PruebaPsicologicaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.PruebaPsicologicaResponseDTO;
import com.clinica.psicologia.system.model.clinical.PruebaPsicologica;

@Component
public class PruebaPsicologicaMapper {

    public PruebaPsicologicaResponseDTO toResponseDTO(PruebaPsicologica entity) {

        PruebaPsicologicaResponseDTO dto = new PruebaPsicologicaResponseDTO();

        dto.setId(entity.getId());

        dto.setPacienteId(entity.getPaciente().getId());
        dto.setPacienteNombre(
                entity.getPaciente().getNombre() + " " +
                entity.getPaciente().getApellido());

        if (entity.getSesion() != null) {
            dto.setSesionId(entity.getSesion().getId());
        }

        dto.setTipoPruebaId(entity.getTipoPrueba().getId());
        dto.setTipoPrueba(entity.getTipoPrueba().getNombre());

        dto.setNombre(entity.getNombre());
        dto.setFechaAplicacion(entity.getFechaAplicacion());
        dto.setArchivoAdjunto(entity.getArchivoAdjunto());

        return dto;
    }

    public List<PruebaPsicologicaResponseDTO> toResponseDTOList(List<PruebaPsicologica> entities) {

        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(PruebaPsicologica entity,
                             PruebaPsicologicaRequestDTO dto) {

        entity.setNombre(dto.getNombre());
        entity.setFechaAplicacion(dto.getFechaAplicacion());
        entity.setArchivoAdjunto(dto.getArchivoAdjunto());
    }

}