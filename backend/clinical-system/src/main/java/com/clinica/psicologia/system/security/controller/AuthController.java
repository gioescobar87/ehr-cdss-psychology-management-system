package com.clinica.psicologia.system.security.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.model.security.RefreshToken;
import com.clinica.psicologia.system.security.dto.ChangePasswordRequest;
import com.clinica.psicologia.system.security.dto.ForgotPasswordRequest;
import com.clinica.psicologia.system.security.dto.LoginRequest;
import com.clinica.psicologia.system.security.dto.RegisterRequest;
import com.clinica.psicologia.system.security.dto.ResetPasswordRequest;
import com.clinica.psicologia.system.security.dto.UserProfileResponse;
import com.clinica.psicologia.system.security.service.AuthService;
import com.clinica.psicologia.system.security.service.JwtService;
import com.clinica.psicologia.system.security.service.RefreshTokenService;
import com.clinica.psicologia.system.security.service.SecurityUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
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
    public Map<String, String> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh-token")
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

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Valid @RequestBody Map<String, String> body) {
        authService.logout(body.get("refreshToken"));
    }

    @GetMapping("/me")
    public UserProfileResponse me(Authentication authentication) {

        return authService.getCurrentUser(
                authentication.getName());
    }

    @PostMapping("/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        authService.changePassword(
                authentication.getName(),
                request);
    }

    /*
     * @PostMapping("/forgot-password")
     * 
     * @ResponseStatus(HttpStatus.NO_CONTENT)
     * public void forgotPassword(
     * 
     * @RequestBody ForgotPasswordRequest request) {
     * 
     * authService.forgotPassword(request);
     * }
     */

    @PostMapping("/reset-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request);
    }

    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
    }

    @PostMapping("/logout-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logoutAll(
            Authentication authentication) {

        authService.logoutAll(
                authentication.getName());
    }
}
