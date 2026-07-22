package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.clinical.ResultadoPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.ResultadoPruebaResponseDTO;
import com.clinica.psicologia.system.model.clinical.ResultadoPrueba;

@Component
public class ResultadoPruebaMapper {

    public ResultadoPruebaResponseDTO toResponseDTO(ResultadoPrueba entity) {

        ResultadoPruebaResponseDTO dto = new ResultadoPruebaResponseDTO();

        dto.setId(entity.getId());

        dto.setPruebaPsicologicaId(entity.getPruebaPsicologica().getId());
        dto.setNombrePrueba(entity.getPruebaPsicologica().getNombre());

        dto.setPacienteId(entity.getPruebaPsicologica().getPaciente().getId());
        dto.setPacienteNombre(
                entity.getPruebaPsicologica().getPaciente().getNombre()
                        + " "
                        + entity.getPruebaPsicologica().getPaciente().getApellido());

        dto.setParametro(entity.getParametro());
        dto.setValor(entity.getValor());
        dto.setUnidadMedida(entity.getUnidadMedida());
        dto.setObservaciones(entity.getObservaciones());

        return dto;
    }

    public List<ResultadoPruebaResponseDTO> toResponseDTOList(List<ResultadoPrueba> entities) {

        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(ResultadoPrueba entity,
                             ResultadoPruebaRequestDTO dto) {

        entity.setParametro(dto.getParametro());
        entity.setValor(dto.getValor());
        entity.setUnidadMedida(dto.getUnidadMedida());
        entity.setObservaciones(dto.getObservaciones());
    }

}