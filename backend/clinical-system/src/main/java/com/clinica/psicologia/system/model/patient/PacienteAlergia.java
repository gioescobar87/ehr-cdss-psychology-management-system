package com.clinica.psicologia.system.model.patient;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.catalog.NivelSeveridadAlergia;
import com.clinica.psicologia.system.model.catalog.SustanciaAlergena;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "paciente_alergia")
public class PacienteAlergia extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "sustancia_alergena_id", nullable = false)
    private SustanciaAlergena sustanciaAlergena;

    @ManyToOne
    @JoinColumn(name = "nivel_severidad_alergias_id")
    private NivelSeveridadAlergia nivelSeveridadAlergia;

    private String tipoReaccion;

    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;
}