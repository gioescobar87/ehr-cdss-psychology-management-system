package com.clinica.psicologia.system.model.clinical;

import java.time.LocalDate;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.catalog.TipoPrueba;
import com.clinica.psicologia.system.model.patient.Paciente;

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
@Table(name = "prueba_psicologica")
public class PruebaPsicologica extends BaseEntity{
    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "sesion_id")
    private Sesion sesion;

    @ManyToOne
    @JoinColumn(name = "tipo_prueba_id")
    private TipoPrueba tipoPrueba;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "fecha_aplicacion")
    private LocalDate fechaAplicacion;

    @Column(name = "archivo_adjunto")
    private String archivoAdjunto;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private Estado estado;
}
