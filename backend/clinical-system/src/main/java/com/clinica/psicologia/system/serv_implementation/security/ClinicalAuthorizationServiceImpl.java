package com.clinica.psicologia.system.serv_implementation.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.security.model.SecurityUser;
import com.clinica.psicologia.system.service.security.ClinicalAuthorizationService;

@Service
public class ClinicalAuthorizationServiceImpl implements ClinicalAuthorizationService {

    @Override
    public Usuario getAuthenticatedUser() {

        SecurityUser securityUser = (SecurityUser) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        return securityUser.getUsuario();
    }
}