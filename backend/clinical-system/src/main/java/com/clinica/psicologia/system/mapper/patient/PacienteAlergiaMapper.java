package com.clinica.psicologia.system.mapper.patient;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.patient.PacienteAlergiaRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteAlergiaResponseDTO;
import com.clinica.psicologia.system.model.patient.PacienteAlergia;

@Component
public class PacienteAlergiaMapper {

    public PacienteAlergiaResponseDTO toResponseDTO(
            PacienteAlergia entity) {

        PacienteAlergiaResponseDTO dto = new PacienteAlergiaResponseDTO();

        dto.setId(entity.getId());

        dto.setPacienteId(entity.getPaciente().getId());

        dto.setPacienteNombre(
                entity.getPaciente().getNombre()
                        + " "
                        + entity.getPaciente().getApellido());

        dto.setSustanciaAlergenaId(
                entity.getSustanciaAlergena().getId());

        dto.setSustanciaAlergena(
                entity.getSustanciaAlergena().getNombre());

        if (entity.getNivelSeveridadAlergia() != null) {

            dto.setNivelSeveridadAlergiaId(
                    entity.getNivelSeveridadAlergia().getId());

            dto.setNivelSeveridadAlergia(
                    entity.getNivelSeveridadAlergia().getNombre());
        }

        dto.setTipoReaccion(entity.getTipoReaccion());
        dto.setObservaciones(entity.getObservaciones());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    public List<PacienteAlergiaResponseDTO> toResponseDTOList(
            List<PacienteAlergia> entities) {

        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(PacienteAlergia entity, PacienteAlergiaRequestDTO dto) {
        entity.setTipoReaccion(dto.getTipoReaccion());
        entity.setObservaciones(dto.getObservaciones());
    }
}