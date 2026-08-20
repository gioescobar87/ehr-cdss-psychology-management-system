package com.clinica.psicologia.system.controller.clinical_context;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.response.clinical_context.ClinicalSessionContextResponseDTO;
import com.clinica.psicologia.system.service.clinical_context.ClinicalSessionContextService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sesion")
@RequiredArgsConstructor
public class ClinicalSessionContextController {

    private final ClinicalSessionContextService clinicalSessionContextService;

    @GetMapping("/{sesionId}/contexto-clinico")
    public ResponseEntity<ClinicalSessionContextResponseDTO> getClinicalSessionContext(
            @PathVariable Integer sesionId) {

        ClinicalSessionContextResponseDTO response =
                clinicalSessionContextService.getClinicalSessionContext(sesionId);

        return ResponseEntity.ok(response);
    }
}