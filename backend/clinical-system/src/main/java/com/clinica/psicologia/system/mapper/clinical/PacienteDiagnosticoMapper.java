package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.response.clinical.PacienteDiagnosticoResponseDTO;
import com.clinica.psicologia.system.model.clinical.PacienteDiagnostico;

@Component
public class PacienteDiagnosticoMapper {

    public PacienteDiagnosticoResponseDTO toResponseDTO(PacienteDiagnostico entity) {

        PacienteDiagnosticoResponseDTO dto = new PacienteDiagnosticoResponseDTO();

        dto.setId(entity.getId());

        dto.setPacienteId(entity.getPaciente().getId());
        dto.setPacienteNombre(entity.getPaciente().getNombre() + " " + entity.getPaciente().getApellido());

        dto.setDiagnosticoId(entity.getDiagnostico().getId());
        dto.setDiagnostico(entity.getDiagnostico().getNombre());

        dto.setCodigoIcd(entity.getDiagnostico().getCodigoIcd10cm());

        dto.setCategoriaDiagnosticaId(entity.getDiagnostico().getCategoriaDiagnostica().getId());
        dto.setCategoriaDiagnostica(entity.getDiagnostico().getCategoriaDiagnostica().getNombre());

        dto.setSesionId(
                entity.getSesion() != null
                        ? entity.getSesion().getId()
                        : null);

        dto.setFechaDiagnostico(entity.getFechaDiagnostico());
        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    public List<PacienteDiagnosticoResponseDTO> toResponseDTOList(List<PacienteDiagnostico> entities) {

        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }
}