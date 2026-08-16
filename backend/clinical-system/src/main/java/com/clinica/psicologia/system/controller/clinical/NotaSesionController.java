package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping
    public NotaSesionResponseDTO create(@Valid @RequestBody NotaSesionRequestDTO request){
        return service.create(request);
    }

    @GetMapping
    public List<NotaSesionResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public NotaSesionResponseDTO findById(@PathVariable Integer id){
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public NotaSesionResponseDTO update(@PathVariable Integer id, @Valid @RequestBody NotaSesionRequestDTO request){
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }
}
