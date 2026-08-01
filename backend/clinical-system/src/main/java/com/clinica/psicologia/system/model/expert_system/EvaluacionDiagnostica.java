package com.clinica.psicologia.system.model.expert_system;

import java.time.LocalDateTime;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.catalog.Estado;
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
    @JoinColumn(name = "arbol_diagnostico_id", nullable = false)
    private ArbolDiagnostico arbolDiagnostico;

    @ManyToOne
    @JoinColumn(name = "diagnostico_final_id")
    private Diagnostico diagnosticoFinal;

    @ManyToOne
    @JoinColumn(name = "diagnostico_sugerido_id")
    private Diagnostico diagnosticoSugerido;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "version_arbol", nullable = false)
    private Integer versionArbol;

    @Column(name = "diagnostico_confirmado", nullable = false)
    private Boolean diagnosticoConfirmado;

    @Column(name = "observaciones_sistema",
            columnDefinition = "TEXT")
    private String observacionesSistema;

    @Column(name = "fecha_evaluacion", nullable = false)
    private LocalDateTime fechaEvaluacion;

    @ManyToOne
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;

    @Column(name = "fecha_inferencia")
    private LocalDateTime fechaInferencia;

    @Column(name = "tiempo_inferencia_ms")
    private Integer tiempoInferenciaMs;
}