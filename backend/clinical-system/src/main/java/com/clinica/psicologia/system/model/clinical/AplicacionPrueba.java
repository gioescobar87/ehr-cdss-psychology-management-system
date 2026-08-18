package com.clinica.psicologia.system.model.clinical;

import java.time.LocalDate;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.catalog.PruebaPsicologica;
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
@Table(name="aplicacion_prueba")
public class AplicacionPrueba extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "sesion_id", nullable = false)
    private Sesion sesion;

    @ManyToOne
    @JoinColumn(name = "prueba_psicologica_id", nullable = false)
    private PruebaPsicologica pruebaPsicologica;

    @Column(name = "fecha_aplicacion")
    private LocalDate fechaAplicacion;

    @Column(name = "archivo_adjunto")
    private String archivoAdjunto;

    @Convert(converter = StringEncryptConverter.class)
    private String interpretacion;

    @ManyToOne
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;
}
