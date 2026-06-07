package com.clinica.psicologia.system.security.scheduler;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.repository.security.PasswordResetTokenRepository;

import jakarta.transaction.Transactional;

@Component
public class PasswordResetTokenCleanupScheduler {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public PasswordResetTokenCleanupScheduler(
            PasswordResetTokenRepository passwordResetTokenRepository) {

        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    private static final Logger logger = LoggerFactory.getLogger(
            PasswordResetTokenCleanupScheduler.class);

    @Transactional
    @Scheduled(cron = "0 0 * * * *")
    public void cleanupExpiredTokens() {

        int deleted = passwordResetTokenRepository.cleanup(
                LocalDateTime.now());

        logger.info(
                "Password reset token cleanup executed. {} records removed.",
                deleted);
    }
}