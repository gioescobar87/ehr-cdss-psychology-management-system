package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.SesionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.SesionResponseDTO;

public interface SesionService {

    SesionResponseDTO create(SesionRequestDTO request);

    List<SesionResponseDTO> findAll();

    SesionResponseDTO findById(Integer id);

    SesionResponseDTO update(Integer id, SesionRequestDTO request);

    void delete(Integer id);

    List<SesionResponseDTO> getByPatient(Integer pacienteId);

    List<SesionResponseDTO> getByUser(Integer usuarioId);

    List<SesionResponseDTO> getByUserActivePatient(Integer usuarioId);

    List<SesionResponseDTO> getByCita(Integer citaId);

    SesionResponseDTO asignarProximaCita(Integer id, Integer citaId);

}