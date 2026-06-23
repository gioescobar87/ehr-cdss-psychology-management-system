package com.clinica.psicologia.system.service.patient;

import java.util.List;

import com.clinica.psicologia.system.dto.request.patient.ContactoEmergenciaRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.ContactoEmergenciaResponseDTO;

public interface ContactoEmergenciaService {

    ContactoEmergenciaResponseDTO crear(ContactoEmergenciaRequestDTO dto);

    List<ContactoEmergenciaResponseDTO> obtenerTodos();

    ContactoEmergenciaResponseDTO obtenerPorId(Integer id);

    List<ContactoEmergenciaResponseDTO> obtenerPorPaciente(Integer pacienteId);

    ContactoEmergenciaResponseDTO actualizar(Integer id, ContactoEmergenciaRequestDTO dto);

    void desactivar(Integer id);
}