package com.clinica.psicologia.system.security.exception.custom;

public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }
}