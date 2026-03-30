package com.clinica.psicologia.system.model.clinical;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.util.encryption.StringEncryptConverter;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@Table(name = "nota_sesion")
public class NotaSesion extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sesion_id")
    private Sesion sesion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Convert(converter = StringEncryptConverter.class)
    private String contenido;

    @Column(name="tipo_nota")
    private String tipoNota;

    @Column(name="fecha_registro")
    private LocalDateTime fechaRegistro;
}