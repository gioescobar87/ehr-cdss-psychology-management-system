package com.clinica.psicologia.system.model.patient;

import java.time.LocalDateTime;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.security.Usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "paciente_asignacion")
public class PacienteAsignacion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_psicologo", nullable = false)
    private Usuario psicologo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_cambio")
    private Usuario usuarioCambio;

    @Column(name = "fecha_asignacion", nullable = false)
    private LocalDateTime fechaAsignacion;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Column(name = "motivo_asignacion")
    private String motivoAsignacion;

    @Column(name = "justificacion_reasignacion")
    private String justificacionReasignacion;
}