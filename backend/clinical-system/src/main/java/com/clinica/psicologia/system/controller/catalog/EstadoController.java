package com.clinica.psicologia.system.controller.catalog;

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

import com.clinica.psicologia.system.dto.request.catalog.EstadoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.EstadoResponseDTO;
import com.clinica.psicologia.system.service.catalog.EstadoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/catalogos/estado")
public class EstadoController {
    private final EstadoService service;

    public EstadoController(EstadoService service){
        this.service = service;
    }

    @GetMapping
    public List<EstadoResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public EstadoResponseDTO findById(@PathVariable Integer id){
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus  .CREATED)
    public EstadoResponseDTO create(@Valid @RequestBody EstadoRequestDTO request){
        return service.create(request);
    }

    @PutMapping("/{id}")
    public EstadoResponseDTO update(@PathVariable Integer id, @Valid @RequestBody EstadoRequestDTO request){
        return service.update(id, request);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }
}
