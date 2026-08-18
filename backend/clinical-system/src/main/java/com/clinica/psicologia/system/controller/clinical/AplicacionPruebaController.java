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

import com.clinica.psicologia.system.dto.request.clinical.AplicacionPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.AplicacionPruebaResponseDTO;
import com.clinica.psicologia.system.service.clinical.AplicacionPruebaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/aplicacion-prueba")
@RequiredArgsConstructor
public class AplicacionPruebaController {

    private final AplicacionPruebaService service;

    @GetMapping
    public List<AplicacionPruebaResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public AplicacionPruebaResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @GetMapping("/sesion/{sesionId}")
    public List<AplicacionPruebaResponseDTO> getBySesion(@PathVariable Integer sesionId) {
        return service.getBySesion(sesionId);
    }

    @GetMapping("/prueba/{pruebaPsicologicaId}")
    public List<AplicacionPruebaResponseDTO> getByPruebaPsicologica(@PathVariable Integer pruebaPsicologicaId) {
        return service.getByPruebaPsicologica(pruebaPsicologicaId);
    }

    @GetMapping("/sesion/{sesionId}/prueba/{pruebaPsicologicaId}")
    public List<AplicacionPruebaResponseDTO> getBySesionAndPrueba(@PathVariable Integer sesionId,@PathVariable Integer pruebaPsicologicaId) {
        return service.getBySesionAndPrueba(sesionId,pruebaPsicologicaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AplicacionPruebaResponseDTO create(@Valid @RequestBody AplicacionPruebaRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public AplicacionPruebaResponseDTO update(@PathVariable Integer id,@Valid @RequestBody AplicacionPruebaRequestDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}