package com.clinica.psicologia.system.repository.clinical;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.InterpretacionPrueba;

public interface InterpretacionPruebaRepository extends JpaRepository<InterpretacionPrueba, Integer> {

    List<InterpretacionPrueba> findByPruebaPsicologicaIdOrderByFechaRegistroDesc(Integer pruebaPsicologicaId);

}