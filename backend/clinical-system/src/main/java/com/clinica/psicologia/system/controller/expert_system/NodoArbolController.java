package com.clinica.psicologia.system.controller.expert_system;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.expert_system.NodoArbolRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.NodoArbolResponseDTO;
import com.clinica.psicologia.system.service.expert_system.NodoArbolService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/nodos-arbol")
@RequiredArgsConstructor
public class NodoArbolController {

    private final NodoArbolService service;

    @GetMapping
    public List<NodoArbolResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public NodoArbolResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @GetMapping("/arbol/{arbolId}")
    public List<NodoArbolResponseDTO> getByArbolDiagnostico(@PathVariable Integer arbolId) {
        return service.getByArbolDiagnostico(arbolId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NodoArbolResponseDTO create(@Valid @RequestBody NodoArbolRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public NodoArbolResponseDTO update(@PathVariable Integer id, @Valid @RequestBody NodoArbolRequestDTO request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeStatus(@PathVariable Integer id, @RequestParam Integer estadoId) {
        service.changeStatus(id, estadoId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}