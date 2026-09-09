package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.clinical.CitaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.CitaResponseDTO;
import com.clinica.psicologia.system.model.clinical.Cita;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CitaMapper {

    private final SesionRepository sesionRepository;

    public CitaResponseDTO toResponseDTO(Cita entity) {

        Integer sessionId = sesionRepository.findFirstByCitaId(entity.getId())
            .map(sesion -> sesion.getId())
            .orElse(null);

        return toResponseDTO(entity, sessionId);
        }

        public CitaResponseDTO toResponseDTO(Cita entity, Integer sessionId) {

        CitaResponseDTO dto = new CitaResponseDTO();

        dto.setId(entity.getId());

        dto.setPacienteId(entity.getPaciente().getId());
        dto.setPacienteNombre(
                entity.getPaciente().getNombre()
                        + " "
                        + entity.getPaciente().getApellido());

        dto.setUsuarioId(entity.getUsuario().getId());
        dto.setUsuarioNombre(
                entity.getUsuario().getNombre()
                        + " "
                        + entity.getUsuario().getApellido());

        dto.setFechaHoraInicio(entity.getFechaHoraInicio());
        dto.setFechaHoraFin(entity.getFechaHoraFin());

        dto.setMotivo(entity.getMotivo());
        dto.setObservaciones(entity.getObservaciones());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        dto.setTieneSesion(sessionId != null);
        dto.setSesionId(sessionId);

        return dto;
    }

    public List<CitaResponseDTO> toResponseDTOList(List<Cita> citas) {
        return citas.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(Cita entity, CitaRequestDTO request) {
        entity.setFechaHoraInicio(request.getFechaHoraInicio());
        entity.setFechaHoraFin(request.getFechaHoraFin());
        entity.setMotivo(request.getMotivo());
        entity.setObservaciones(request.getObservaciones());
    }
}