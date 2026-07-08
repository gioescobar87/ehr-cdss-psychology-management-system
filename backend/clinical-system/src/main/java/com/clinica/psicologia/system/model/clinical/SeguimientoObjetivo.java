package com.clinica.psicologia.system.model.clinical;

import java.time.LocalDateTime;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.util.encryption.StringEncryptConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "seguimiento_objetivo")
public class SeguimientoObjetivo extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "objetivo_terapia_id", nullable = false)
    private ObjetivoTerapia objetivoTerapia;

    @ManyToOne
    @JoinColumn(name = "sesion_id", nullable = false)
    private Sesion sesion;

    @Column(name = "descripcion_avance", nullable = false)
    @Convert(converter = StringEncryptConverter.class)
    private String descripcionAvance;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    @PrePersist
    public void prePersist() {

        if (fechaRegistro == null) {
            fechaRegistro = LocalDateTime.now();
        }
    }

}