package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.clinical.SeguimientoObjetivoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.SeguimientoObjetivoResponseDTO;
import com.clinica.psicologia.system.model.clinical.SeguimientoObjetivo;

@Component
public class SeguimientoObjetivoMapper {

    public SeguimientoObjetivoResponseDTO toResponseDTO(SeguimientoObjetivo entity) {

        SeguimientoObjetivoResponseDTO dto = new SeguimientoObjetivoResponseDTO();

        dto.setId(entity.getId());
        dto.setObjetivoTerapiaId(entity.getObjetivoTerapia().getId());
        dto.setPlanTratamientoId(entity.getObjetivoTerapia().getPlanTratamiento().getId());
        dto.setPacienteDiagnosticoId(entity.getObjetivoTerapia().getPlanTratamiento().getPacienteDiagnostico().getId());

        dto.setPacienteId(
                entity.getObjetivoTerapia().getPlanTratamiento().getPacienteDiagnostico().getPaciente().getId());
        dto.setPacienteNombre(
                entity.getObjetivoTerapia().getPlanTratamiento().getPacienteDiagnostico().getPaciente().getNombre()
                        + " " + entity.getObjetivoTerapia().getPlanTratamiento().getPacienteDiagnostico().getPaciente()
                                .getApellido());

        dto.setSesionId(entity.getSesion().getId());

        dto.setUsuarioId(entity.getSesion().getUsuario().getId());
        dto.setUsuario(entity.getSesion().getUsuario().getNombre());

        dto.setDescripcionAvance(entity.getDescripcionAvance());
        dto.setFechaRegistro(entity.getFechaRegistro());

        return dto;
    }

    public List<SeguimientoObjetivoResponseDTO> toResponseDTOList(List<SeguimientoObjetivo> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(SeguimientoObjetivo entity, SeguimientoObjetivoRequestDTO dto) {
        entity.setDescripcionAvance(dto.getDescripcionAvance());
    }

}