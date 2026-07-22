package com.clinica.psicologia.system.controller.clinical;

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

import com.clinica.psicologia.system.dto.request.clinical.InterpretacionPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.InterpretacionPruebaResponseDTO;
import com.clinica.psicologia.system.service.clinical.InterpretacionPruebaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/interpretacion-prueba")
@RequiredArgsConstructor
public class InterpretacionPruebaController {

    private final InterpretacionPruebaService service;

    @GetMapping
    public List<InterpretacionPruebaResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public InterpretacionPruebaResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @GetMapping("/prueba/{pruebaPsicologicaId}")
    public List<InterpretacionPruebaResponseDTO> getByPruebaPsicologica(
            @PathVariable Integer pruebaPsicologicaId) {

        return service.getByPruebaPsicologica(pruebaPsicologicaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InterpretacionPruebaResponseDTO create(
            @Valid @RequestBody InterpretacionPruebaRequestDTO request) {

        return service.create(request);
    }

    @PutMapping("/{id}")
    public InterpretacionPruebaResponseDTO update(
            @PathVariable Integer id,
            @Valid @RequestBody InterpretacionPruebaRequestDTO request) {

        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

}