package com.clinica.psicologia.system.controller.security;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.request.security.OpcionRequestDTO;
import com.clinica.psicologia.system.dto.response.security.OpcionResponseDTO;
import com.clinica.psicologia.system.dto.response.security.OpcionTreeResponseDTO;
import com.clinica.psicologia.system.service.security.OpcionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
@RequestMapping("/api/opciones")
@RequiredArgsConstructor
public class OpcionController {

    private final OpcionService opcionService;

    @GetMapping("path")
    public String getMethodName(@RequestParam String param) {
        return new String();
    }

    @GetMapping
    public List<OpcionResponseDTO> findAll() {
        return opcionService.findAll();
    }

    @GetMapping("/{id}")
    public OpcionResponseDTO findById(
            @PathVariable Integer id) {

        return opcionService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OpcionResponseDTO create(
            @Valid @RequestBody OpcionRequestDTO request) {

        return opcionService.create(request);
    }

    @PutMapping("/{id}")
    public OpcionResponseDTO update(
            @PathVariable Integer id,
            @Valid @RequestBody OpcionRequestDTO request) {

        return opcionService.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeEstado(
            @PathVariable Integer id,
            @Valid @RequestBody EstadoChangeRequestDTO request) {

        opcionService.changeStatus(id, request.getEstadoId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Integer id) {

        opcionService.delete(id);
    }

    @GetMapping("/modulo/{moduloId}")
    public List<OpcionResponseDTO> findByModulo(
            @PathVariable Integer moduloId) {

        return opcionService.findByModulo(moduloId);
    }

    @GetMapping("/{id}/hijas")
    public List<OpcionResponseDTO> findChildren(
            @PathVariable Integer id) {

        return opcionService.findChildren(id);
    }

    @GetMapping("/tree")
    public List<OpcionTreeResponseDTO> getTree() {

        return opcionService.getTree();
    }
}