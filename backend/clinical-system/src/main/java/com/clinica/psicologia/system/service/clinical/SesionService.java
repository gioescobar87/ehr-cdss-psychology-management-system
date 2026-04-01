package com.clinica.psicologia.system.service.clinical;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.repository.clinical.SesionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SesionService {
    private final SesionRepository repository;
}
