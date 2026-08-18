package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.clinical.AplicacionPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.AplicacionPruebaResponseDTO;
import com.clinica.psicologia.system.model.clinical.AplicacionPrueba;

@Component
public class AplicacionMapper {

    public AplicacionPruebaResponseDTO toResponseDTO(AplicacionPrueba entity) {

        AplicacionPruebaResponseDTO dto = new AplicacionPruebaResponseDTO();

        dto.setId(entity.getId());
        dto.setSesionId(entity.getSesion().getId());
        dto.setPruebaPsicologicaId(entity.getPruebaPsicologica().getId());
        dto.setFechaAplicacion(entity.getFechaAplicacion());
        dto.setArchivoAdjunto(entity.getArchivoAdjunto());
        dto.setInterpretacion(entity.getInterpretacion());
        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    public List<AplicacionPruebaResponseDTO> toResponseList(List<AplicacionPrueba> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(AplicacionPrueba entity, AplicacionPruebaRequestDTO dto) {
        entity.setArchivoAdjunto(dto.getArchivoAdjunto());
        entity.setInterpretacion(dto.getInterpretacion());
    }
}