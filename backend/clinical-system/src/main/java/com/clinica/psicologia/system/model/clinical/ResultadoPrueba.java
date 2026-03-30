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
public class ResultadoPrueba extends BaseEntity{
    
    @ManyToOne
    @JoinColumn(name = "prueba_psicologica_id")
    private PruebaPsicologica prueba;

    private String parametro;
    private String valor;
    private String unidadMedida;

    @Convert(converter = StringEncryptConverter.class)
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private Estado estado;
}