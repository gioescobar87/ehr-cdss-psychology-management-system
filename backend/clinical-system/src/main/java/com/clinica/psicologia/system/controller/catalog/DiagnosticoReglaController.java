package com.clinica.psicologia.system.controller.catalog;

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

import com.clinica.psicologia.system.dto.request.catalog.DiagnosticoReglaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.DiagnosticoReglaResponseDTO;
import com.clinica.psicologia.system.service.catalog.DiagnosticoReglaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/catalogos/diagnostico-regla")
public class DiagnosticoReglaController {

    private final DiagnosticoReglaService service;

    @GetMapping
    public List<DiagnosticoReglaResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public DiagnosticoReglaResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @GetMapping("/diagnostico/{diagnosticoId}")
    public List<DiagnosticoReglaResponseDTO> findByDiagnosticoId(@PathVariable Integer diagnosticoId) {
        return service.findByDiagnosticoId(diagnosticoId);
    }

    @GetMapping("/tipo-regla/{tipoReglaId}")
    public List<DiagnosticoReglaResponseDTO> findByTipoReglaId(@PathVariable Integer tipoReglaId) {
        return service.findByTipoReglaId(tipoReglaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DiagnosticoReglaResponseDTO create(@Valid @RequestBody DiagnosticoReglaRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public DiagnosticoReglaResponseDTO update(@PathVariable Integer id,
            @Valid @RequestBody DiagnosticoReglaRequestDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
