package com.clinica.psicologia.system.mapper.security;

import com.clinica.psicologia.system.dto.response.security.PermisoResponseDTO;
import com.clinica.psicologia.system.model.security.Permiso;

public class PermisoMapper {
    public PermisoResponseDTO toResponse(Permiso permiso) {
        PermisoResponseDTO dto = new PermisoResponseDTO();
        dto.setId(permiso.getId());
        dto.setNombre(permiso.getNombre());
        dto.setDescripcion(permiso.getDescripcion());
        dto.setModuloId(permiso.getModulo().getId());
        dto.setModuloNombre(permiso.getModulo().getNombre());
        return dto;
    }
}
