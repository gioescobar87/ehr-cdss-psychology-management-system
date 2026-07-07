package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.clinical.PlanTratamientoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.PlanTratamientoResponseDTO;
import com.clinica.psicologia.system.model.clinical.PlanTratamiento;

@Component
public class PlanTratamientoMapper {

    public PlanTratamientoResponseDTO toResponseDTO(PlanTratamiento entity) {

        PlanTratamientoResponseDTO dto = new PlanTratamientoResponseDTO();

        dto.setId(entity.getId());

        dto.setPacienteDiagnosticoId(entity.getPacienteDiagnostico().getId());

        dto.setPacienteId(entity.getPacienteDiagnostico().getPaciente().getId());

        dto.setPacienteNombre(entity.getPacienteDiagnostico().getPaciente().getNombre() + " "
                + entity.getPacienteDiagnostico().getPaciente().getApellido());

        dto.setDiagnosticoId(entity.getPacienteDiagnostico().getDiagnostico().getId());

        dto.setDiagnostico(entity.getPacienteDiagnostico().getDiagnostico().getNombre());

        dto.setCodigoDsm(entity.getPacienteDiagnostico().getDiagnostico().getCodigoDsm());

        dto.setDescripcionGeneral(entity.getDescripcionGeneral());

        dto.setFechaInicio(entity.getFechaInicio());

        dto.setFechaFin(entity.getFechaFin());

        dto.setEstadoId(entity.getEstado().getId());

        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    public List<PlanTratamientoResponseDTO> toResponseDTOList(
            List<PlanTratamiento> entities) {

        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(PlanTratamiento entity, PlanTratamientoRequestDTO dto) {

        entity.setDescripcionGeneral(dto.getDescripcionGeneral());

        entity.setFechaInicio(dto.getFechaInicio());

        entity.setFechaFin(dto.getFechaFin());
    }

}