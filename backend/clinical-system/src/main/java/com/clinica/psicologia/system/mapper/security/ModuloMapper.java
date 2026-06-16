package com.clinica.psicologia.system.mapper.security;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.response.security.ModuloResponseDTO;
import com.clinica.psicologia.system.model.security.Modulo;

@Component
public class ModuloMapper {
    public ModuloResponseDTO toResponse(Modulo modulo) {
        ModuloResponseDTO dto = new ModuloResponseDTO();

        dto.setId(modulo.getId());
        dto.setNombre(modulo.getNombre());
        dto.setDescripcion(modulo.getDescripcion());
        dto.setEstadoId(modulo.getEstado().getId());
        dto.setEstado(modulo.getEstado().getNombreEstado());
        return dto;
    }

    public List<ModuloResponseDTO> toResponseList(List<Modulo> modulos) {
        return modulos.stream().map(this::toResponse).toList();
    }
}
