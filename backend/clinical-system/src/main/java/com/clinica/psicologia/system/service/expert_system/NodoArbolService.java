package com.clinica.psicologia.system.service.expert_system;

import java.util.List;

import com.clinica.psicologia.system.dto.request.expert_system.NodoArbolRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.NodoArbolResponseDTO;

public interface NodoArbolService {

    List<NodoArbolResponseDTO> findAll();

    NodoArbolResponseDTO findById(Integer id);

    List<NodoArbolResponseDTO> findByArbolDiagnostico(Integer arbolDiagnosticoId);

    NodoArbolResponseDTO create(NodoArbolRequestDTO request);

    NodoArbolResponseDTO update(Integer id, NodoArbolRequestDTO request);

    void changeStatus(Integer id, Integer estadoId);

    void delete(Integer id);
}