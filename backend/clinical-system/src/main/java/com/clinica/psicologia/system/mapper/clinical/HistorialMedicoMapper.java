package com.clinica.psicologia.system.mapper.clinical;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.clinical.HistorialMedicoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.HistorialMedicoResponseDTO;
import com.clinica.psicologia.system.model.clinical.HistorialMedico;

@Component
public class HistorialMedicoMapper {

    public HistorialMedico toEntity(HistorialMedicoRequestDTO dto){
        HistorialMedico historialMedico = new HistorialMedico();

        historialMedico.setFechaDiagnostico(dto.fechaDiagnostico());
        historialMedico.setTratamientoActual(dto.tratamientoActual());
        historialMedico.setObservaciones(dto.observaciones());

        return historialMedico;
    }
    
    public HistorialMedicoResponseDTO toResponse(HistorialMedico historialMedico){
        return new HistorialMedicoResponseDTO(
            historialMedico.getId(),
            historialMedico.getCondicionMedica().getNombre(),
            historialMedico.getFechaDiagnostico(),
            historialMedico.getTratamientoActual(),
            historialMedico.getObservaciones()
        );
    }
}
