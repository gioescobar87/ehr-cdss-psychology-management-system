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

import com.clinica.psicologia.system.dto.request.clinical.ResultadoPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.ResultadoPruebaResponseDTO;
import com.clinica.psicologia.system.service.clinical.ResultadoPruebaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/resultado-prueba")
@RequiredArgsConstructor
public class ResultadoPruebaController {

    private final ResultadoPruebaService service;

    @GetMapping
    public List<ResultadoPruebaResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResultadoPruebaResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResultadoPruebaResponseDTO create(@Valid @RequestBody ResultadoPruebaRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ResultadoPruebaResponseDTO update(@PathVariable Integer id,
            @Valid @RequestBody ResultadoPruebaRequestDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

}