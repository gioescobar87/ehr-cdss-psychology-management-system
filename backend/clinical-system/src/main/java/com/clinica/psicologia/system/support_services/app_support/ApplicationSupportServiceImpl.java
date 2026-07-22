package com.clinica.psicologia.system.support_services.app_support;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApplicationSupportServiceImpl implements ApplicationSupportService {

    private final EstadoRepository estadoRepository;

    @Override
    public Estado getActiveState() {
        return estadoRepository.getByNombre("ACTIVO")
                .orElseThrow(() -> new ResourceNotFoundException("Active state not found"));
    }

    @Override
    public Estado getInactiveState() {
        return estadoRepository.getByNombre("INACTIVO")
                .orElseThrow(() -> new ResourceNotFoundException("Inactive state not found"));
    }

    @Override
    public Estado getDeletedState() {
        return estadoRepository.getByNombre("ELIMINADO")
                .orElseThrow(() -> new ResourceNotFoundException("Deleted state not found"));
    }
}