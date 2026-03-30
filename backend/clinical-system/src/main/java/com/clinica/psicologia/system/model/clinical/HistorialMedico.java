package com.clinica.psicologia.system.model.clinical;

import java.time.LocalDate;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.CondicionMedica;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.util.encryption.StringEncryptConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "historial_medico")
@Getter
@Setter
public class HistorialMedico extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "condicion_medica_id")
    private CondicionMedica condicionMedica;

    @Column(name = "fecha_diagnostico")
    private LocalDate fechaDiagnostico;

    @Convert(converter = StringEncryptConverter.class)
    @Column(name = "tratamiento_actual")
    private String tratamientoActual;

    @Convert(converter = StringEncryptConverter.class)
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private Estado estado;
}
