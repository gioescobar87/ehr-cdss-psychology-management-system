package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.clinical.SesionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionResponseDTO;
import com.clinica.psicologia.system.model.clinical.Sesion;

@Component
public class SesionMapper {
    public SesionResponseDTO toResponseDTO(Sesion entity) {
        SesionResponseDTO dto = new SesionResponseDTO();

        dto.setId(entity.getId());

        dto.setPacienteId(entity.getCita().getPaciente().getId());
        dto.setPacienteNombre(entity.getCita().getPaciente().getNombre() + " " + entity.getPaciente().getApellido());

        dto.setUsuarioId(entity.getUsuario().getId());
        dto.setUsuarioNombre(entity.getUsuario().getNombre() + " " + entity.getUsuario().getApellido());

        dto.setTipoSesionId(entity.getTipoSesion().getId());
        dto.setTipoSesion(entity.getTipoSesion().getNombre());

        dto.setFechaSesion(entity.getFechaSesion());
        dto.setObservacionesGenerales(entity.getObservacionesGenerales());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        dto.setCitaId(entity.getCita().getId());

        dto.setProximaCitaId(entity.getProximaCita() != null ? entity.getProximaCita().getId() : null);

        return dto;
    }

    public List<SesionResponseDTO> toResponseDTOList(List<Sesion> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(Sesion entity, SesionRequestDTO request) {
        entity.setObservacionesGenerales(request.getObservacionesGenerales());
    }
}
