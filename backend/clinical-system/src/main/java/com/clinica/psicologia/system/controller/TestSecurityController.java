package com.clinica.psicologia.system.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/test/security")
public class TestSecurityController {

    @GetMapping("/authenticated")
    public String authenticated(){
        return "AUTHENTICATED OK";
    }

    /* @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public String admin(){
        return "ADMIN OK";
    }

    @PreAuthorize("hasAuthority('PERM_PATIENT_READ')")
    @GetMapping("/patient-read")
    public String patientRead(){
        return "PATIENT READ OK";
    } */

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/admin")
    public String admin() {
        return "ADMINISTRADOR OK";
    }

    @PreAuthorize("hasAuthority('GESTION_PACIENTES')")
    @GetMapping("/pacientes")
    public String pacientes() {
        return "GESTION PACIENTES OK";
    }
    
    
}