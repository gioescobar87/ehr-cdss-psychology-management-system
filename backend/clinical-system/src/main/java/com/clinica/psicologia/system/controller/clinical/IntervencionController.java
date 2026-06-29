package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.clinical.IntervencionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.IntervencionResponseDTO;
import com.clinica.psicologia.system.service.clinical.IntervencionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/intervencion")
@RequiredArgsConstructor
@Validated
public class IntervencionController {

    private final IntervencionService service;

    @PostMapping
    public IntervencionResponseDTO create(
            @Valid @RequestBody IntervencionRequestDTO request) {

        return service.create(request);
    }

    @GetMapping
    public List<IntervencionResponseDTO> findAll() {

        return service.findAll();
    }

    @GetMapping("/{id}")
    public IntervencionResponseDTO findById(
            @PathVariable Integer id) {

        return service.findById(id);
    }

    @PutMapping("/{id}")
    public IntervencionResponseDTO update(
            @PathVariable Integer id,
            @Valid @RequestBody IntervencionRequestDTO request) {

        return service.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    public void changeStatus(
            @PathVariable Integer id,
            @RequestParam Integer estadoId) {

        service.changeStatus(id, estadoId);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Integer id) {

        service.delete(id);
    }

}