package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.web.multipart.MultipartFile;

import com.clinica.psicologia.system.dto.request.clinical.AplicacionPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.AplicacionPruebaResponseDTO;

public interface AplicacionPruebaService {

    AplicacionPruebaResponseDTO create(AplicacionPruebaRequestDTO dto, MultipartFile attachment);

    List<AplicacionPruebaResponseDTO> findAll();

    AplicacionPruebaResponseDTO findById(Integer id);

    List<AplicacionPruebaResponseDTO> getBySesion(Integer sesionId);

    List<AplicacionPruebaResponseDTO> getByPruebaPsicologica(Integer pruebaPsicologicaId);

    List<AplicacionPruebaResponseDTO> getBySesionAndPrueba(Integer sesionId, Integer pruebaPsicologicaId);

    AplicacionPruebaResponseDTO update(Integer id, AplicacionPruebaRequestDTO dto, MultipartFile attachment);

    void delete(Integer id);

    List<AplicacionPruebaResponseDTO> getByPaciente(Integer pacienteId);

    InputStreamResource getAttachment(Integer id);
}