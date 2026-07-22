package com.clinica.psicologia.system.model.clinical;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.util.encryption.StringEncryptConverter;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "resultado_prueba")
public class ResultadoPrueba extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "prueba_psicologica_id", nullable = false)
    private PruebaPsicologica pruebaPsicologica;

    @Column(name = "parametro", nullable = false, length = 200)
    private String parametro;

    @Column(name = "valor", length = 200)
    private String valor;

    @Column(name = "unidad_medida", length = 50)
    private String unidadMedida;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    @Convert(converter = StringEncryptConverter.class)
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;

}