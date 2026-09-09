package com.clinica.psicologia.system.model;

import java.time.LocalDateTime;

public interface CoordinatorPatientProjection {

    Integer getPatientId();

    String getPatientName();

    Integer getPsychologistId();

    String getPsychologistName();

    String getStatus();

    LocalDateTime getStartDate();

    String getStartReason();

    LocalDateTime getClosingDate();

    String getClosingReason();

    String getReferralSource();
}