package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.InterpretacionPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.InterpretacionPruebaResponseDTO;

public interface InterpretacionPruebaService {

    InterpretacionPruebaResponseDTO create(InterpretacionPruebaRequestDTO request);

    List<InterpretacionPruebaResponseDTO> findAll();

    InterpretacionPruebaResponseDTO findById(Integer id);

    List<InterpretacionPruebaResponseDTO> getByPruebaPsicologica(Integer pruebaPsicologicaId);

    InterpretacionPruebaResponseDTO update(Integer id, InterpretacionPruebaRequestDTO request);

    void delete(Integer id);

}