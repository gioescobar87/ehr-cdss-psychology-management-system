package com.clinica.psicologia.system.repository.catalog;

import com.clinica.psicologia.system.model.catalog.CondicionMedica;

public interface CondicionMedicaRepository extends CatalogRepository<CondicionMedica> {
    boolean existsByCodigoReferencia(String codigoReferencia);

    boolean existsByCodigoReferenciaAndIdNot(String codigoReferencia, Integer id);
}
