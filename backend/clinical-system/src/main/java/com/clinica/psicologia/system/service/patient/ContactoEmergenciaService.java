package com.clinica.psicologia.system.service.patient;

import java.util.List;

import com.clinica.psicologia.system.dto.request.patient.ContactoEmergenciaRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.ContactoEmergenciaResponseDTO;

public interface ContactoEmergenciaService {

    ContactoEmergenciaResponseDTO create(ContactoEmergenciaRequestDTO request);

    List<ContactoEmergenciaResponseDTO> findAll();

    ContactoEmergenciaResponseDTO findById(Integer id);

    List<ContactoEmergenciaResponseDTO> getByPatient(Integer pacienteId);

    ContactoEmergenciaResponseDTO update(Integer id, ContactoEmergenciaRequestDTO request);

    void changeStatus(Integer id, Integer estadoId);

    void delete(Integer id);
}