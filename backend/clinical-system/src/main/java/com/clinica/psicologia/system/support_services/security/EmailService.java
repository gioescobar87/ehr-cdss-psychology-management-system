package com.clinica.psicologia.system.support_services.security;

public interface EmailService {
    void sendTemporaryPassword(String recipientEmail, String recipientName, String username, String temporaryPassword);

    void sendPasswordResetEmail(String recipientEmail, String recipientName, String resetToken);
}