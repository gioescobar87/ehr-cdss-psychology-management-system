package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    public List<AplicacionPruebaResponseDTO> getBySesionAndPrueba(@PathVariable Integer sesionId,
            @PathVariable Integer pruebaPsicologicaId) {
        return service.getBySesionAndPrueba(sesionId, pruebaPsicologicaId);
    }

    @PostMapping(consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public AplicacionPruebaResponseDTO create(@Valid @RequestPart("request") AplicacionPruebaRequestDTO request,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) {
        return service.create(request, attachment);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public AplicacionPruebaResponseDTO update(@PathVariable Integer id,
            @Valid @RequestPart("request") AplicacionPruebaRequestDTO request,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) {
        return service.update(id, request, attachment);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/{id}/archivo")
    public ResponseEntity<InputStreamResource> getAttachment(
            @PathVariable Integer id) {

        InputStreamResource resource = service.getAttachment(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"prueba-psicologica.pdf\"")
                .body(resource);
    }
}