package com.clinica.psicologia.system.service.expert_system;

import java.util.List;

import com.clinica.psicologia.system.dto.request.expert_system.ReglaNodoRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.ReglaNodoResponseDTO;

public interface ReglaNodoService {

    List<ReglaNodoResponseDTO> findAll();

    ReglaNodoResponseDTO findById(Integer id);

    List<ReglaNodoResponseDTO> getByNodoOrigen(Integer nodoOrigenId);

    ReglaNodoResponseDTO create(ReglaNodoRequestDTO request);

    ReglaNodoResponseDTO update(Integer id, ReglaNodoRequestDTO request);

    void changeStatus(Integer id, Integer estadoId);

    void delete(Integer id);

}