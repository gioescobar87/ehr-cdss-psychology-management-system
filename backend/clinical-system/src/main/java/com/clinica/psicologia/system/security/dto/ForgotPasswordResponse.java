package com.clinica.psicologia.system.security.dto;

public class ForgotPasswordResponse {

    private String token;

    public ForgotPasswordResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}