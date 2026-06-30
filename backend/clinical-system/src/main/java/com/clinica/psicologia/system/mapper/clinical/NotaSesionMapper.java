package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.clinical.NotaSesionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.NotaSesionResponseDTO;
import com.clinica.psicologia.system.model.clinical.NotaSesion;

@Component
public class NotaSesionMapper {
    public NotaSesionResponseDTO toResponseDTO(NotaSesion entity) {
        NotaSesionResponseDTO dto = new NotaSesionResponseDTO();

        dto.setId(entity.getId());
        dto.setSesionId(entity.getSesion().getId());

        dto.setUsuarioId(entity.getUsuario().getId());
        dto.setUsuarioNombre(entity.getUsuario().getNombre() + " " + entity.getUsuario().getApellido());

        dto.setContenido(entity.getContenido());
        dto.setTipoNota(entity.getTipoNota());
        dto.setFechaRegistro(entity.getFechaRegistro());

        return dto;
    }

    public List<NotaSesionResponseDTO> toResponseDTOList(List<NotaSesion> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(NotaSesion entity, NotaSesionRequestDTO request){
        entity.setContenido(request.getContenido());
        entity.setTipoNota(request.getTipoNota());
    }
}
