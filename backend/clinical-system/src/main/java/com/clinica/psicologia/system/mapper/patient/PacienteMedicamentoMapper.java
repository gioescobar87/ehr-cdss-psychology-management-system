package com.clinica.psicologia.system.mapper.patient;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.patient.PacienteMedicamentoRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteMedicamentoResponseDTO;
import com.clinica.psicologia.system.model.patient.PacienteMedicamento;

@Component
public class PacienteMedicamentoMapper {

    public PacienteMedicamentoResponseDTO toResponseDTO(PacienteMedicamento entity) {

        PacienteMedicamentoResponseDTO dto = new PacienteMedicamentoResponseDTO();

        dto.setId(entity.getId());

        dto.setPacienteId(entity.getPaciente().getId());
        dto.setPacienteNombre(
                entity.getPaciente().getNombre()
                        + " "
                        + entity.getPaciente().getApellido());

        dto.setMedicamentoId(entity.getMedicamento().getId());
        dto.setMedicamento(entity.getMedicamento().getNombre());

        dto.setDosis(entity.getDosis());
        dto.setFrecuencia(entity.getFrecuencia());
        dto.setViaAdministracion(entity.getViaAdministracion());

        dto.setFechaInicio(entity.getFechaInicio());
        dto.setFechaFin(entity.getFechaFin());

        dto.setPrescritoPor(entity.getPrescritoPor());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    public List<PacienteMedicamentoResponseDTO> toResponseDTOList(List<PacienteMedicamento> entities) {

        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(PacienteMedicamento entity, PacienteMedicamentoRequestDTO dto) {

        entity.setDosis(dto.getDosis());
        entity.setFrecuencia(dto.getFrecuencia());
        entity.setViaAdministracion(dto.getViaAdministracion());
        entity.setFechaInicio(dto.getFechaInicio());
        entity.setFechaFin(dto.getFechaFin());
        entity.setPrescritoPor(dto.getPrescritoPor());
    }
}