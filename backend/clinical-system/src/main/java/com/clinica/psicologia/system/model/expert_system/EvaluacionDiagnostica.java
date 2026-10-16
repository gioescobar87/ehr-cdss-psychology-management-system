package com.clinica.psicologia.system.model.expert_system;

import java.time.LocalDateTime;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.security.Usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "evaluacion_diagnostica")
public class EvaluacionDiagnostica extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "sesion_id", nullable = false)
    private Sesion sesion;

    @ManyToOne
    @JoinColumn(name = "diagnostico_sugerido_id")
    private Diagnostico diagnosticoSugerido;

    @ManyToOne
    @JoinColumn(name = "diagnostico_seleccionado_id")
    private Diagnostico diagnosticoSeleccionado;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "concordancia_diagnostica")
    private Integer concordanciaDiagnostica;

    @Column(name = "fecha_hora_inferencia", nullable = false)
    private LocalDateTime fechaHoraInferencia;
}