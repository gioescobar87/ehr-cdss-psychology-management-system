package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.clinical.PacienteDiagnosticoRequestDTO;
import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.PacienteDiagnosticoResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.PlanTratamientoResponseDTO;
import com.clinica.psicologia.system.service.clinical.PacienteDiagnosticoService;
import com.clinica.psicologia.system.service.clinical.PlanTratamientoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/paciente-diagnostico")
public class PacienteDiagnosticoController {

    private final PacienteDiagnosticoService service;
    private final PlanTratamientoService planTratamientoService;

    @GetMapping
    public List<PacienteDiagnosticoResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public PacienteDiagnosticoResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PacienteDiagnosticoResponseDTO create(@Valid @RequestBody PacienteDiagnosticoRequestDTO request) {
        return service.create(request);
    }

    @PatchMapping("/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeStatus(@PathVariable Integer id, @RequestBody EstadoChangeRequestDTO request) {
        service.changeStatus(id);
    }

    @GetMapping("/{id}/planes")
    public ResponseEntity<List<PlanTratamientoResponseDTO>> obtenerTratamientos(@PathVariable Integer id) {
        return ResponseEntity.ok(planTratamientoService.getByPacienteDiagnostico(id));
    }
}