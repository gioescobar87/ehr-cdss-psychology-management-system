package com.clinica.psicologia.system.model.clinical;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.CondicionMedica;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.catalog.Parentesco;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.util.encryption.StringEncryptConverter;

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
@Table(name = "historial_familiar")
public class HistorialFamiliar extends BaseEntity{
    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "condicion_medica_id")
    private CondicionMedica condicion_medica;

    @ManyToOne
    @JoinColumn(name = "parentesco_id")
    private Parentesco parentesco;

    @Convert(converter = StringEncryptConverter.class)
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private Estado estado;
}
