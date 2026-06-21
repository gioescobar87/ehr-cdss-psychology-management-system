package com.clinica.psicologia.system.repository.catalog;

import java.util.Optional;

import com.clinica.psicologia.system.model.catalog.Medicamento;
import com.clinica.psicologia.system.model.security.Modulo;

public interface MedicamentoRepository extends CatalogRepository<Medicamento> {
    Optional<Modulo> findByNombreComercial(String nombreComercial);
}
