package com.clinica.psicologia.system.repository.catalog;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.catalog.DiagnosticoCriterioClinico;

public interface DiagnosticoCriterioClinicoRepository extends JpaRepository<DiagnosticoCriterioClinico, Integer> {

    List<DiagnosticoCriterioClinico> findByDiagnosticoId(Integer diagnosticoId);

    List<DiagnosticoCriterioClinico> findByCriterioClinicoId(Integer criterioClinicoId);

    Optional<DiagnosticoCriterioClinico> findByDiagnosticoIdAndCriterioClinicoId(Integer diagnosticoId, Integer criterioClinicoId);
}
