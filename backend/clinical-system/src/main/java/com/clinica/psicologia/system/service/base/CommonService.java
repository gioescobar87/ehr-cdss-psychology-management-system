package com.clinica.psicologia.system.service.base;

import com.clinica.psicologia.system.model.catalog.Estado;

public interface CommonService {
    Estado getActiveState();
}


/*
public interface ClinicalAuthorizationService {

    Usuario getAuthenticatedUser();

    void validateAssignedPsychologist(Paciente paciente);
}
     */