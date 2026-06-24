package com.clinica.psicologia.system.controller.patient;

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

import com.clinica.psicologia.system.dto.request.patient.ContactoEmergenciaRequestDTO;
import com.clinica.psicologia.system.dto.request.security.EstadoChangeRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.ContactoEmergenciaResponseDTO;
import com.clinica.psicologia.system.service.patient.ContactoEmergenciaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contacto-emergencia")
public class ContactoEmergenciaController {

    private final ContactoEmergenciaService service;

    public ContactoEmergenciaController(ContactoEmergenciaService service){
        this.service = service;
    }

    @GetMapping
    public List<ContactoEmergenciaResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ContactoEmergenciaResponseDTO findById(@PathVariable Integer id){
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactoEmergenciaResponseDTO create(@Valid @RequestBody ContactoEmergenciaRequestDTO request){
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ContactoEmergenciaResponseDTO update(@PathVariable Integer id, @Valid @RequestBody ContactoEmergenciaRequestDTO request){
        return service.update(id, request);
    }

    @PatchMapping("/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeStatus(@PathVariable Integer id, @Valid @RequestBody EstadoChangeRequestDTO request){
        service.changeStatus(id, request.getEstadoId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }
}