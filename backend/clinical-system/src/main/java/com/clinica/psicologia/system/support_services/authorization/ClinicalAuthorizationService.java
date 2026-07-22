package com.clinica.psicologia.system.support_services.authorization;

import com.clinica.psicologia.system.model.clinical.InterpretacionPrueba;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.security.Usuario;

public interface ClinicalAuthorizationService {

    Usuario getAuthenticatedUser();

    void validateAssignedPsychologist(Paciente paciente);

    void validateSessionOwner(Sesion sesion);

    void validateInterpretationOwner(InterpretacionPrueba interpretacion);

}