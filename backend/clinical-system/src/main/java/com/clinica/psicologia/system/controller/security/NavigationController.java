package com.clinica.psicologia.system.controller.security;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.response.security.NavigationModuleResponseDTO;
import com.clinica.psicologia.system.service.security.NavigationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class NavigationController {

    private final NavigationService navigationService;

    @GetMapping("/navigation")
    public List<NavigationModuleResponseDTO> getNavigation() {
        return navigationService.getNavigation();
    }
}