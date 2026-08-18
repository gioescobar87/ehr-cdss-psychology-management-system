package com.clinica.psicologia.system.support_services.authorization;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.patient.PacienteAsignacion;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.patient.PacienteAsignacionRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.model.SecurityUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClinicalAuthorizationServiceImpl
        implements ClinicalAuthorizationService {

    private final PacienteAsignacionRepository pacienteAsignacionRepository;

    @Override
    public Usuario getAuthenticatedUser() {

        SecurityUser securityUser =
                (SecurityUser) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        return securityUser.getUsuario();
    }

    @Override
    public void validateAssignedPsychologist(Paciente paciente) {

        PacienteAsignacion asignacion = pacienteAsignacionRepository
                .findFirstByPacienteIdAndFechaFinIsNull(paciente.getId())
                .orElseThrow(() -> new BusinessRuleException(
                        "The patient has no active psychologist assignment."));

        Usuario usuario = getAuthenticatedUser();

        if (!asignacion.getPsicologo().getId().equals(usuario.getId())) {

            throw new BusinessRuleException(
                    "Only the psychologist currently assigned to the patient may perform this action.");
        }
    }

    @Override
    public void validateSessionOwner(Sesion sesion) {

        Usuario usuario = getAuthenticatedUser();

        if (!sesion.getUsuario().getId().equals(usuario.getId())) {

            throw new BusinessRuleException(
                    "Only the psychologist who conducted the session may perform this action.");
        }
    }

}