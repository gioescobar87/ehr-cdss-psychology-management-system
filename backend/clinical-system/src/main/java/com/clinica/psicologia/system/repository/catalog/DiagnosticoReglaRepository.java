package com.clinica.psicologia.system.repository.catalog;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.catalog.DiagnosticoRegla;

public interface DiagnosticoReglaRepository extends JpaRepository<DiagnosticoRegla, Integer> {

    List<DiagnosticoRegla> findByDiagnosticoId(Integer diagnosticoId);

    List<DiagnosticoRegla> findByTipoReglaId(Integer tipoReglaId);
}
