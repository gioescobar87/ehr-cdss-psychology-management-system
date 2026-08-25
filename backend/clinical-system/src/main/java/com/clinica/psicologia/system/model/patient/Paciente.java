package com.clinica.psicologia.system.model.patient;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.catalog.EstadoCivil;
import com.clinica.psicologia.system.model.catalog.NivelEscolaridad;
import com.clinica.psicologia.system.util.encryption.StringEncryptConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "paciente")
@Getter
@Setter
public class Paciente extends BaseEntity {
    
    @Convert(converter = StringEncryptConverter.class)
    private String nombre;

    @Convert(converter = StringEncryptConverter.class)
    private String apellido;

    @Convert(converter = StringEncryptConverter.class)
    private String dpi;

    private LocalDate fechaNacimiento;

    @Column(name = "sexo", nullable = false, length = 1)
    private String sexo;

    @Convert(converter = StringEncryptConverter.class)
    private String direccion;

    @Convert(converter = StringEncryptConverter.class)
    private String telefono;

    private String ocupacion;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estado_civil_id")
    private EstadoCivil estadoCivil;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nivel_escolaridad_id")
    private NivelEscolaridad nivelEscolaridad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estado_id")
    private Estado estado;

    @Convert(converter = StringEncryptConverter.class)
    private String refiere;

    @PrePersist
    public void prePersist() {

        if (fechaRegistro == null) {
            fechaRegistro = LocalDateTime.now();
        }
    }
}
