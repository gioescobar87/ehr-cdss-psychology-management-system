package com.clinica.psicologia.system.model.clinical;

import com.clinica.psicologia.system.model.base.BaseCatalog;
import com.clinica.psicologia.system.model.catalog.TipoIntervencion;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "intervencion")
public class Intervencion extends BaseCatalog{
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_intervencion_id")
    private TipoIntervencion tipoIntervencion;
}
