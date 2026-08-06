package com.clinica.psicologia.system.service.security;

import java.util.List;

import com.clinica.psicologia.system.dto.response.security.NavigationModuleResponseDTO;

public interface NavigationService {

    List<NavigationModuleResponseDTO> getNavigation();
}