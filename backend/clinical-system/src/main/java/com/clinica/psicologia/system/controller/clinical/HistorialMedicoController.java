package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.clinical.HistorialMedicoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.HistorialMedicoResponseDTO;
import com.clinica.psicologia.system.service.clinical.HistorialMedicoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/historial-medico")
@RequiredArgsConstructor
public class HistorialMedicoController {
    private final HistorialMedicoService historialMedicoService;

    @PostMapping
    public ResponseEntity<HistorialMedicoResponseDTO> crear(@RequestBody HistorialMedicoRequestDTO dto){
        return ResponseEntity.ok(historialMedicoService.crear(dto));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<HistorialMedicoResponseDTO>> obtenerPorPaciente(@PathVariable Integer pacienteId){
        return ResponseEntity.ok(historialMedicoService.obtenerPorPaciente(pacienteId));
    }

}
