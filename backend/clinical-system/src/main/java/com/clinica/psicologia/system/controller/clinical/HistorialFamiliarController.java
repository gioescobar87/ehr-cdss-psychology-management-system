package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.clinica.psicologia.system.dto.request.clinical.HistorialFamiliarRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.HistorialFamiliarResponseDTO;
import com.clinica.psicologia.system.service.clinical.HistorialFamiliarService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/historial-familiar")
@RequiredArgsConstructor
public class HistorialFamiliarController {

    private final HistorialFamiliarService historialFamiliarService;

    
    //CREAR HISTORIAL FAMILIAR
    @PostMapping
    public ResponseEntity<HistorialFamiliarResponseDTO> crear(
            @RequestBody HistorialFamiliarRequestDTO dto) {

        return ResponseEntity.ok(
                historialFamiliarService.crear(dto)
        );
    }

    //OBTENER HISTORIAL POR PACIENTE
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<HistorialFamiliarResponseDTO>>
            obtenerPorPaciente(
                    @PathVariable Integer pacienteId) {

        return ResponseEntity.ok(
                historialFamiliarService
                        .obtenerPorPaciente(pacienteId)
        );
    }

        @PutMapping("/{id}")
        public ResponseEntity<HistorialFamiliarResponseDTO> actualizar(
                        @PathVariable Integer id,
                        @RequestBody HistorialFamiliarRequestDTO dto) {
                return ResponseEntity.ok(historialFamiliarService.actualizar(id, dto));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> desactivar(@PathVariable Integer id) {
                historialFamiliarService.desactivar(id);
                return ResponseEntity.noContent().build();
        }
}