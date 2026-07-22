package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.ResultadoPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.ResultadoPruebaResponseDTO;

public interface ResultadoPruebaService {

    ResultadoPruebaResponseDTO create(ResultadoPruebaRequestDTO request);

    List<ResultadoPruebaResponseDTO> findAll();

    ResultadoPruebaResponseDTO findById(Integer id);

    List<ResultadoPruebaResponseDTO> getByPruebaPsicologica(Integer pruebaPsicologicaId);

    ResultadoPruebaResponseDTO update(Integer id, ResultadoPruebaRequestDTO request);

    void delete(Integer id);

}