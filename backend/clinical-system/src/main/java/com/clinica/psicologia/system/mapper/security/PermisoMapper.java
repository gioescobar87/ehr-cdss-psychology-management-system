package com.clinica.psicologia.system.mapper.security;

import java.util.List;

import com.clinica.psicologia.system.dto.response.security.PermisoResponseDTO;
import com.clinica.psicologia.system.model.security.Permiso;

public class PermisoMapper {
    public PermisoResponseDTO toResponse(Permiso permiso) {
        PermisoResponseDTO dto = new PermisoResponseDTO();
        dto.setId(permiso.getId());
        dto.setNombre(permiso.getNombre());
        dto.setDescripcion(permiso.getDescripcion());
        dto.setEstadoId(permiso.getEstado().getId());
        dto.setEstado(permiso.getEstado().getNombre());
        return dto;
    }

    public List<PermisoResponseDTO> toResponseList(List<Permiso> permisos) {

        return permisos.stream()
                .map(this::toResponse)
                .toList();
    }
}
