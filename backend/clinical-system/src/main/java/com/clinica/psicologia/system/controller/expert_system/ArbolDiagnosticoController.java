package com.clinica.psicologia.system.controller.expert_system;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.expert_system.ArbolDiagnosticoRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.ArbolDiagnosticoResponseDTO;
import com.clinica.psicologia.system.dto.response.expert_system.NodoArbolResponseDTO;
import com.clinica.psicologia.system.service.expert_system.ArbolDiagnosticoService;
import com.clinica.psicologia.system.service.expert_system.NodoArbolService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/arbol-diagnostico")
@RequiredArgsConstructor
public class ArbolDiagnosticoController {

    private final ArbolDiagnosticoService service;
    private final NodoArbolService nodoArbolService;

    @GetMapping
    public List<ArbolDiagnosticoResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ArbolDiagnosticoResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<ArbolDiagnosticoResponseDTO> getByCategoriaDiagnostica(@PathVariable Integer categoriaId) {
        return service.getByCategoriaDiagnostica(categoriaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ArbolDiagnosticoResponseDTO create(@Valid @RequestBody ArbolDiagnosticoRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ArbolDiagnosticoResponseDTO update(@PathVariable Integer id,
            @Valid @RequestBody ArbolDiagnosticoRequestDTO request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/toggle-status")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void toggleStatus(@PathVariable Integer id) {
        service.toggleStatus(id);
    }

    @PatchMapping("/{id}/activar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void activate(@PathVariable Integer id) {
        service.activate(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/{id}/nodos")
    public ResponseEntity<List<NodoArbolResponseDTO>> obtenerNodos(@PathVariable Integer id) {
        return ResponseEntity.ok(nodoArbolService.findByArbolDiagnostico(id));
    }
}