package com.clinica.psicologia.system.service.clinical;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.repository.clinical.ResultadoPruebaRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ResultadoPruebaService {
    private final ResultadoPruebaRepository repository;
}
