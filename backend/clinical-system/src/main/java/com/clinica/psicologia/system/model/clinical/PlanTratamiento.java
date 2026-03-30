package com.clinica.psicologia.system.model.clinical;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.util.encryption.StringEncryptConverter;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@Entity
@Table(name = "plan_tratamiento")
public class PlanTratamiento extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "paciente_diagnostico_id")
    private PacienteDiagnostico PacienteDiagnostico;

    @Convert(converter = StringEncryptConverter.class)
    private String descripcionGeneral;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private Estado estado;
}