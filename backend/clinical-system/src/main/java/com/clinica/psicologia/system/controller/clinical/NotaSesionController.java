package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.clinica.psicologia.system.dto.request.clinical.NotaSesionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.NotaSesionResponseDTO;
import com.clinica.psicologia.system.service.clinical.NotaSesionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/nota-sesion")
@RequiredArgsConstructor
public class NotaSesionController {
    
    private final NotaSesionService service;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public NotaSesionResponseDTO createJson(@Valid @RequestBody NotaSesionRequestDTO request) {
        return service.create(request, null);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public NotaSesionResponseDTO create(
            @Valid @RequestPart("request") NotaSesionRequestDTO request,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) {
        return service.create(request, attachment);
    }

    @GetMapping
    public List<NotaSesionResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public NotaSesionResponseDTO findById(@PathVariable Integer id){
        return service.findById(id);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public NotaSesionResponseDTO updateJson(
            @PathVariable Integer id,
            @Valid @RequestBody NotaSesionRequestDTO request) {
        return service.update(id, request, null);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public NotaSesionResponseDTO update(
            @PathVariable Integer id,
            @Valid @RequestPart("request") NotaSesionRequestDTO request,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) {
        return service.update(id, request, attachment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }

    @GetMapping("/{id}/archivo")
    public ResponseEntity<InputStreamResource> getAttachment(@PathVariable Integer id) {
        InputStreamResource resource = service.getAttachment(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"nota-sesion.pdf\"")
                .body(resource);
    }
}
