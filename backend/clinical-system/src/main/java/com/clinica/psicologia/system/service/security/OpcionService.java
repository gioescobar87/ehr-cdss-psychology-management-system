package com.clinica.psicologia.system.service.security;

import java.util.List;

import com.clinica.psicologia.system.dto.request.security.OpcionRequestDTO;
import com.clinica.psicologia.system.dto.response.security.OpcionResponseDTO;
import com.clinica.psicologia.system.dto.response.security.OpcionTreeResponseDTO;

public interface OpcionService {
    List<OpcionResponseDTO> findAll();

    OpcionResponseDTO findById(Integer id);

    OpcionResponseDTO create(OpcionRequestDTO request);

    OpcionResponseDTO update(Integer id, OpcionRequestDTO request);

    void delete(Integer id);

    void changeStatus(Integer id, Integer estadoId);

    List<OpcionResponseDTO> findByModulo(Integer moduloId);

    List<OpcionResponseDTO> findChildren(Integer opcionId);

    List<OpcionTreeResponseDTO> getTree();
}
