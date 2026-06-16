package com.clinica.psicologia.system.service.security;

import java.util.List;

import com.clinica.psicologia.system.dto.request.security.ModuloRequestDTO;
import com.clinica.psicologia.system.dto.response.security.ModuloResponseDTO;

public interface ModuloService {
    List<ModuloResponseDTO> findAll();

    ModuloResponseDTO findById(Integer id);

    ModuloResponseDTO create(ModuloRequestDTO request);

    ModuloResponseDTO update(Integer id, ModuloRequestDTO request);

    void changeStatus(Integer id, Integer estadoId);

    void delete(Integer id);
}
