package com.clinica.psicologia.system.repository.clinical;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.SeguimientoObjetivo;

public interface SeguimientoObjetivoRepository extends JpaRepository<SeguimientoObjetivo, Integer> {

    List<SeguimientoObjetivo> findByObjetivoTerapiaId(Integer objetivoTerapiaId);

}