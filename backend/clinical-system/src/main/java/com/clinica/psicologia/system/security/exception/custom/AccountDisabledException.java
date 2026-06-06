package com.clinica.psicologia.system.security.exception.custom;

public class AccountDisabledException extends RuntimeException {
    public AccountDisabledException(String message) {
        super(message);
    }

}
