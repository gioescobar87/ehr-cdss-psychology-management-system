package com.clinica.psicologia.system.service.clinical;

import java.time.LocalDate;
import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.CancelarCitaRequestDTO;
import com.clinica.psicologia.system.dto.request.clinical.CitaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.CancelacionResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.CitaResponseDTO;

public interface CitaService {

    CitaResponseDTO create(CitaRequestDTO request);

    List<CitaResponseDTO> findAll();

    CitaResponseDTO findById(Integer id);

    CitaResponseDTO update(Integer id,
            CitaRequestDTO request);

    void changeStatus(Integer id,
            Integer estadoId);

    void delete(Integer id);

    List<CitaResponseDTO> getAgenda(
            LocalDate fecha);

    List<CitaResponseDTO> getByPatient(Integer pacienteId);

    List<CitaResponseDTO> getByUser(Integer usuarioId);

    CitaResponseDTO cancelar(Integer citaId, CancelarCitaRequestDTO request);

    CancelacionResponseDTO getCancelacion(Integer citaId);
}