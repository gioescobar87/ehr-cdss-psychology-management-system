package com.clinica.psicologia.system.model;

public interface CoordinatorSummaryMetricsProjection {

    Integer getPsychologistId();

    Long getAppointmentCount();

    Long getAttendedCount();

    Long getCancelledCount();
}