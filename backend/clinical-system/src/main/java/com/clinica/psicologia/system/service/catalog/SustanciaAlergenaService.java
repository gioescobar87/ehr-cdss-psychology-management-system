package com.clinica.psicologia.system.service.catalog;

import java.util.List;

import com.clinica.psicologia.system.dto.request.catalog.SustanciaAlergenaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.SustanciaAlergenaResponseDTO;

public interface SustanciaAlergenaService {

        List<SustanciaAlergenaResponseDTO> findAll();

        SustanciaAlergenaResponseDTO findById(Integer id);

        SustanciaAlergenaResponseDTO create(SustanciaAlergenaRequestDTO request);

        SustanciaAlergenaResponseDTO update(Integer id, SustanciaAlergenaRequestDTO request);

        void changeStatus(Integer id, Integer estadoId);

        void delete(Integer id);
}