package com.clinica.psicologia.system.model.clinical;

import java.time.LocalDate;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.util.encryption.StringEncryptConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "plan_tratamiento")
public class PlanTratamiento extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "paciente_diagnostico_id", nullable = false)
    private PacienteDiagnostico pacienteDiagnostico;

    @Column(name = "descripcion_general")
    @Convert(converter = StringEncryptConverter.class)
    private String descripcionGeneral;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @ManyToOne
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;
}