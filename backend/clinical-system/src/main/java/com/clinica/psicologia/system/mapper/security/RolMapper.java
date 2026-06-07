package com.clinica.psicologia.system.mapper.security;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.response.security.RolResponseDTO;
import com.clinica.psicologia.system.model.security.Rol;

@Component
public class RolMapper {

    public RolResponseDTO toResponse(Rol rol) {

        RolResponseDTO dto = new RolResponseDTO();

        dto.setId(rol.getId());
        dto.setNombre(rol.getNombre());
        dto.setDescripcion(rol.getDescripcion());

        if (rol.getEstado() != null) {
            dto.setEstadoId(rol.getEstado().getId());
            dto.setEstado(rol.getEstado().getNombreEstado());
        }

        return dto;
    }

    public List<RolResponseDTO> toResponseList(List<Rol> roles) {
        return roles.stream().map(this::toResponse).toList();
    }
}