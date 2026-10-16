package com.clinica.psicologia.system.controller.expert_system;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.expert_system.EvaluacionDiagnosticaRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.EvaluacionDiagnosticaResponseDTO;
import com.clinica.psicologia.system.service.expert_system.EvaluacionDiagnosticaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/evaluacion-diagnostica")
public class EvaluacionDiagnosticaController {

    private final EvaluacionDiagnosticaService service;

    @GetMapping
    public List<EvaluacionDiagnosticaResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public EvaluacionDiagnosticaResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<EvaluacionDiagnosticaResponseDTO> findByPaciente(@PathVariable Integer pacienteId) {
        return service.findByPaciente(pacienteId);
    }

    @GetMapping("/sesion/{sesionId}")
    public List<EvaluacionDiagnosticaResponseDTO> findBySesion(@PathVariable Integer sesionId) {
        return service.findBySesion(sesionId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EvaluacionDiagnosticaResponseDTO create(
            @Valid @RequestBody EvaluacionDiagnosticaRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public EvaluacionDiagnosticaResponseDTO update(@PathVariable Integer id,@Valid @RequestBody EvaluacionDiagnosticaRequestDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

}