package com.clinica.psicologia.system.model.clinical;

import java.time.LocalDateTime;

import com.clinica.psicologia.system.model.base.BaseEntity;
import com.clinica.psicologia.system.model.security.Usuario;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cancelacion")
@Getter
@Setter
public class Cancelacion extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cita_id")
    private Cita cita;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private String motivoCancelacion;

    private LocalDateTime fechaCancelacion;

}