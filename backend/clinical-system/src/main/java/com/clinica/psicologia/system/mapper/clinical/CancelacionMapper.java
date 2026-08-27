package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.response.clinical.CancelacionResponseDTO;
import com.clinica.psicologia.system.model.clinical.Cancelacion;

@Component
public class CancelacionMapper {

    public CancelacionResponseDTO toResponseDTO(
            Cancelacion entity) {

        CancelacionResponseDTO dto = new CancelacionResponseDTO();

        dto.setId(entity.getId());

        dto.setCitaId(entity.getCita().getId());

        if (entity.getUsuario() != null) {

            dto.setUsuarioId(entity.getUsuario().getId());

            dto.setUsuarioNombre(
                    entity.getUsuario().getNombre()
                            + " "
                            + entity.getUsuario().getApellido());
        }

        dto.setMotivoCancelacion(entity.getMotivoCancelacion());

        dto.setFechaCancelacion(entity.getFechaCancelacion());

        dto.setSolicitudPaciente(entity.getSolicitudPaciente());

        return dto;
    }

    public List<CancelacionResponseDTO> toResponseDTOList(List<Cancelacion> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

}