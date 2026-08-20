package com.clinica.psicologia.system.support_services.app_support;

import com.clinica.psicologia.system.model.catalog.Estado;

public interface ApplicationSupportService {
    Estado getActiveState();

    Estado getInactiveState();

    Estado getDeletedState();

    Estado getEstado(String nombre);
}