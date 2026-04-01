package com.clinica.psicologia.system.service.clinical;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.repository.clinical.PacienteDiagnosticoRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PacienteDiagnosticoService {
    private final PacienteDiagnosticoRepository repository;
}
