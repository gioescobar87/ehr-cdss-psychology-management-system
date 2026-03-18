package com.clinica.psicologia.system.security.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dev")
public class DevController {

    private final PasswordEncoder encoder;

    public DevController(PasswordEncoder encoder) {
        this.encoder = encoder;
    }

    @GetMapping("/hash")
    public String hash(@RequestParam String value){
        return encoder.encode(value);
    }
}