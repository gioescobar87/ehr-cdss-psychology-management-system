package com.clinica.psicologia.system.controller.clinical;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.request.clinical.PruebaPsicologicaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.InterpretacionPruebaResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.PruebaPsicologicaResponseDTO;
import com.clinica.psicologia.system.dto.response.clinical.ResultadoPruebaResponseDTO;
import com.clinica.psicologia.system.service.clinical.InterpretacionPruebaService;
import com.clinica.psicologia.system.service.clinical.PruebaPsicologicaService;
import com.clinica.psicologia.system.service.clinical.ResultadoPruebaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/prueba-psicologica")
@RequiredArgsConstructor
public class PruebaPsicologicaController {

    private final PruebaPsicologicaService service;
    private final ResultadoPruebaService resultadoPruebaService;
    private final InterpretacionPruebaService interpretacionPruebaService;

    @GetMapping
    public List<PruebaPsicologicaResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public PruebaPsicologicaResponseDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @GetMapping("/tipo/{tipoPruebaId}")
    public List<PruebaPsicologicaResponseDTO> getByTipoPrueba(@PathVariable Integer tipoPruebaId) {
        return service.getByTipoPrueba(tipoPruebaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PruebaPsicologicaResponseDTO create(@Valid @RequestBody PruebaPsicologicaRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public PruebaPsicologicaResponseDTO update(@PathVariable Integer id, @Valid @RequestBody PruebaPsicologicaRequestDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/{id}/resultados")
    public ResponseEntity<List<ResultadoPruebaResponseDTO>> obtenerResultados(@PathVariable Integer id) {
        return ResponseEntity.ok(resultadoPruebaService.getByPruebaPsicologica(id));
    }

    @GetMapping("/{id}/interpretacion")
    public ResponseEntity<List<InterpretacionPruebaResponseDTO>> obtenerInterpretaciones(@PathVariable Integer id) {
        return ResponseEntity.ok(interpretacionPruebaService.getByPruebaPsicologica(id));
    }
}