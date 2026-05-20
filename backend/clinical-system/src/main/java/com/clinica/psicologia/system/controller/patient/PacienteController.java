package com.clinica.psicologia.system.controller.patient;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.patient.PacienteRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteResponseDTO;
import com.clinica.psicologia.system.service.patient.PacienteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService service;

    @PostMapping
    public ResponseEntity<PacienteResponseDTO> crear(
            @RequestBody PacienteRequestDTO dto) {

        return ResponseEntity.ok(service.crearPaciente(dto));
    }

    @GetMapping
    public List<PacienteResponseDTO> listar() {
        return service.obtenerPacientes();
    }

    @GetMapping("/{id}")
    public PacienteResponseDTO obtener(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }
}