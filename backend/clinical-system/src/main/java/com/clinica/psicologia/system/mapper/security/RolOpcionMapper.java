package com.clinica.psicologia.system.mapper.security;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.response.security.RolOpcionResponseDTO;
import com.clinica.psicologia.system.model.security.RolOpcion;

@Component
public class RolOpcionMapper {

    public RolOpcionResponseDTO toResponseDTO(
            RolOpcion entity) {

        RolOpcionResponseDTO dto =
                new RolOpcionResponseDTO();

        dto.setId(entity.getId());

        dto.setRolId(
                entity.getRol().getId());

        dto.setOpcionId(
                entity.getOpcion().getId());

        dto.setOpcion(
                entity.getOpcion().getNombre());

        dto.setVisible(
                entity.getVisible());

        dto.setEstadoId(
                entity.getEstado().getId());

        dto.setEstado(
                entity.getEstado()
                        .getNombreEstado());

        return dto;
    }

    public List<RolOpcionResponseDTO> toResponseDTOList(
            List<RolOpcion> entities) {

        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }
}