package com.clinica.psicologia.system.support_services.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void sendTemporaryPassword(
            String recipientEmail,
            String recipientName,
            String username,
            String temporaryPassword) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(recipientEmail);
        message.setSubject("Credenciales de acceso - Clinical System");

        message.setText("""
                Hola %s,

                Se ha creado una cuenta de usuario para el sistema de gestión de expedientes clínicos psicológicos.

                Tus credenciales iniciales son:

                Usuario: %s
                Contraseña temporal: %s

                Por seguridad, cambia esta contraseña después de iniciar sesión.

                Si no solicitaste esta cuenta, comunícate con el administrador del sistema.

                Clinical System
                """.formatted(
                recipientName,
                username,
                temporaryPassword));

        mailSender.send(message);
    }

    @Override
    public void sendPasswordResetEmail(
            String recipientEmail,
            String recipientName,
            String resetToken) {

        String resetUrl = frontendUrl
                + "/reset-password?token="
                + resetToken;

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(recipientEmail);
        message.setSubject("Restablecimiento de contraseña");
        message.setText(
                "Hola " + recipientName + ",\n\n"
                        + "Hemos recibido una solicitud para restablecer "
                        + "la contraseña de tu cuenta en el Sistema Integral "
                        + "de Gestión de Expedientes Clínicos Psicológicos.\n\n"
                        + "Para establecer una nueva contraseña, utiliza el "
                        + "siguiente enlace:\n\n"
                        + resetUrl + "\n\n"
                        + "Este enlace es válido durante 1 hora y solo puede "
                        + "utilizarse una vez.\n\n"
                        + "Si no solicitaste este cambio, puedes ignorar este "
                        + "correo. Tu contraseña actual permanecerá sin cambios.\n\n"
                        + "Saludos,\n"
                        + "Sistema Integral de Gestión de Expedientes "
                        + "Clínicos Psicológicos");

        mailSender.send(message);
    }
}