package com.clinica.psicologia.system.serv_implementation.base;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.base.CommonService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommonServiceImpl implements CommonService {

    private final EstadoRepository estadoRepository;

    @Override
    public Estado getActiveState() {
        return estadoRepository.getByNombre("ACTIVO")
                .orElseThrow(() -> new ResourceNotFoundException("Active state not found"));
    }
    
}


/*
@Service
@RequiredArgsConstructor
public class ClinicalAuthorizationServiceImpl implements ClinicalAuthorizationService {

    private final PacienteAsignacionRepository pacienteAsignacionRepository;

    @Override
    public Usuario getAuthenticatedUser() {

        SecurityUser securityUser = (SecurityUser) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        return securityUser.getUsuario();
    }

    @Override
    public void validateAssignedPsychologist(Paciente paciente) {

        PacienteAsignacion asignacion = pacienteAsignacionRepository
                .findFirstByPacienteIdAndFechaFinIsNull(paciente.getId())
                .orElseThrow(() ->
                        new BusinessRuleException("The patient has no active psychologist assignment."));

        Usuario usuario = getAuthenticatedUser();

        if (!asignacion.getPsicologo().getId().equals(usuario.getId())) {

            throw new BusinessRuleException("Only the psychologist currently assigned to the patient may perform this action.");
        }
    }
}
     */