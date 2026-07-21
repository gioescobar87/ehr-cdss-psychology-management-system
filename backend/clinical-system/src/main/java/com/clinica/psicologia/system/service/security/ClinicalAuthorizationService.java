package com.clinica.psicologia.system.service.security;

import com.clinica.psicologia.system.model.security.Usuario;

public interface ClinicalAuthorizationService {

    Usuario getAuthenticatedUser();

}