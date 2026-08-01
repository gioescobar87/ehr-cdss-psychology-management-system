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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.expert_system.ReglaNodoRequestDTO;
import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.ReglaNodoResponseDTO;
import com.clinica.psicologia.system.service.expert_system.ReglaNodoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/regla-nodo")
public class ReglaNodoController {

    private final ReglaNodoService service;

    @GetMapping
    public List<ReglaNodoResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ReglaNodoResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @GetMapping("/{nodoOrigenId}/nodo")
    public List<ReglaNodoResponseDTO> findByNodoOrigen(@PathVariable Integer nodoOrigenId) {
        return service.findByNodoOrigen(nodoOrigenId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReglaNodoResponseDTO create(@Valid @RequestBody ReglaNodoRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ReglaNodoResponseDTO update(@PathVariable Integer id,@Valid@RequestBody ReglaNodoRequestDTO request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeStatus(@PathVariable Integer id,@RequestBody EstadoChangeRequestDTO request) {
        service.changeStatus(id,request.getEstadoId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}