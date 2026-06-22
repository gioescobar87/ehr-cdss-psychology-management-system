package com.clinica.psicologia.system.mapper.security;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.response.security.OpcionResponseDTO;
import com.clinica.psicologia.system.model.security.Opcion;

@Component
public class OpcionMapper {

    public OpcionResponseDTO toResponseDTO(Opcion opcion) {

        OpcionResponseDTO dto = new OpcionResponseDTO();

        dto.setId(opcion.getId());

        dto.setModuloId(opcion.getModulo().getId());

        dto.setOpcionPadreId(
                opcion.getOpcionPadre() != null
                        ? opcion.getOpcionPadre().getId()
                        : null);

        dto.setNombre(opcion.getNombre());

        dto.setDescripcion(opcion.getDescripcion());

        dto.setRutaFrontend(opcion.getRutaFrontend());

        dto.setComponente(opcion.getComponente());

        dto.setIcono(opcion.getIcono());

        dto.setOrden(opcion.getOrden());

        dto.setVisibleMenu(opcion.getVisibleMenu());

        dto.setRequiereAutenticacion(opcion.getRequiereAutenticacion());

        dto.setEsMenuPrincipal(opcion.getEsMenuPrincipal());

        dto.setEstadoId(opcion.getEstado().getId());

        dto.setEstado(opcion.getEstado().getNombre());

        return dto;
    }

    public List<OpcionResponseDTO> toResponseDTOList(
            List<Opcion> opciones) {

        return opciones.stream()
                .map(this::toResponseDTO)
                .toList();
    }
}