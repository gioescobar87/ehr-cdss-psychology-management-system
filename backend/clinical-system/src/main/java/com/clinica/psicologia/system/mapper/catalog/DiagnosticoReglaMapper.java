package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.DiagnosticoReglaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.DiagnosticoReglaResponseDTO;
import com.clinica.psicologia.system.model.catalog.DiagnosticoRegla;

@Component
public class DiagnosticoReglaMapper {

    public DiagnosticoReglaResponseDTO toResponse(DiagnosticoRegla entity) {
        DiagnosticoReglaResponseDTO dto = new DiagnosticoReglaResponseDTO();

        dto.setId(entity.getId());
        dto.setDiagnosticoId(entity.getDiagnostico() != null ? entity.getDiagnostico().getId() : null);
        dto.setDiagnostico(entity.getDiagnostico() != null ? entity.getDiagnostico().getNombre() : null);
        dto.setTipoReglaId(entity.getTipoRegla() != null ? entity.getTipoRegla().getId() : null);
        dto.setTipoRegla(entity.getTipoRegla() != null ? entity.getTipoRegla().getNombre() : null);
        dto.setValorRegla(entity.getValorRegla());
        dto.setOperadorId(entity.getOperador() != null ? entity.getOperador().getId() : null);
        dto.setOperador(entity.getOperador() != null ? entity.getOperador().getNombre() : null);
        dto.setParametro(entity.getParametro());

        return dto;
    }

    public List<DiagnosticoReglaResponseDTO> toResponseList(List<DiagnosticoRegla> entities) {
        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    public void updateEntity(DiagnosticoRegla entity, DiagnosticoReglaRequestDTO dto) {
        entity.setValorRegla(dto.getValorRegla());
        entity.setParametro(dto.getParametro());
    }
}
