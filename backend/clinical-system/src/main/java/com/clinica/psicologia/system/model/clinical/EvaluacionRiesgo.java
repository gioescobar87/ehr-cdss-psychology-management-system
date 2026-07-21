package com.clinica.psicologia.system.model.clinical;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.NivelRiesgo;
import com.clinica.psicologia.system.model.catalog.TipoRiesgo;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.util.encryption.StringEncryptConverter;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "evaluacion_riesgo")
public class EvaluacionRiesgo extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "sesion_id", nullable = false)
    private Sesion sesion;

    @ManyToOne
    @JoinColumn(name = "tipo_riesgo_id", nullable = false)
    private TipoRiesgo tipoRiesgo;

    @ManyToOne
    @JoinColumn(name = "nivel_riesgo_id", nullable = false)
    private NivelRiesgo nivelRiesgo;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    @Convert(converter = StringEncryptConverter.class)
    private String observaciones;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;
}