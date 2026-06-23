package com.clinica.psicologia.system.mapper.patient;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.response.patient.ContactoEmergenciaResponseDTO;
import com.clinica.psicologia.system.model.patient.ContactoEmergencia;

@Component
public class ContactoEmergenciaMapper {

    public ContactoEmergenciaResponseDTO toResponseDTO(ContactoEmergencia entity) {
        ContactoEmergenciaResponseDTO dto = new ContactoEmergenciaResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setPacienteId(entity.getPaciente().getId());
        dto.setPacienteNombre(entity.getPaciente().getNombre() + " " + entity.getPaciente().getApellido());
        dto.setParentescoId(entity.getParentesco().getId());
        dto.setParentesco(entity.getParentesco().getNombre());
        dto.setTelefono(entity.getTelefono());
        dto.setDireccion(entity.getDireccion());
        dto.setObservaciones(entity.getObservaciones());
        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    public List<ContactoEmergenciaResponseDTO> toResponseDTOList(List<ContactoEmergencia> contactoEmergencias) {
        return contactoEmergencias.stream()
                .map(this::toResponseDTO)
                .toList();
    }
}
