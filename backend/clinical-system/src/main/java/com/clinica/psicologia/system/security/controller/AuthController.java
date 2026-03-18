package com.clinica.psicologia.system.security.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.security.LoginRequest;
import com.clinica.psicologia.system.model.security.RefreshToken;
import com.clinica.psicologia.system.security.service.AuthService;
import com.clinica.psicologia.system.security.service.JwtService;
import com.clinica.psicologia.system.security.service.RefreshTokenService;
import com.clinica.psicologia.system.security.service.SecurityUserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final SecurityUserService userService;
    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            RefreshTokenService refreshTokenService,
            SecurityUserService userService,
            JwtService jwtService) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public Map<String, String> refresh(
            @RequestParam String refreshToken) {

        RefreshToken newToken = refreshTokenService.rotateRefreshToken(refreshToken);

        var user = userService.loadUserByUsername(
                newToken.getUsuario().getUsername());

        String access = jwtService.generateToken(user);

        return Map.of(
                "accessToken", access,
                "refreshToken", newToken.getToken());
    }
}
