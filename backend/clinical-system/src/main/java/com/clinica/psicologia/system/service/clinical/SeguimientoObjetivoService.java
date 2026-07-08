package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.SeguimientoObjetivoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.SeguimientoObjetivoResponseDTO;

public interface SeguimientoObjetivoService {

    List<SeguimientoObjetivoResponseDTO> findAll();

    SeguimientoObjetivoResponseDTO findById(Integer id);

    List<SeguimientoObjetivoResponseDTO> getByObjetivoTerapia(Integer objetivoTerapiaId);

    SeguimientoObjetivoResponseDTO create(SeguimientoObjetivoRequestDTO dto);

    SeguimientoObjetivoResponseDTO update(Integer id, SeguimientoObjetivoRequestDTO dto);

    void delete(Integer id);

}