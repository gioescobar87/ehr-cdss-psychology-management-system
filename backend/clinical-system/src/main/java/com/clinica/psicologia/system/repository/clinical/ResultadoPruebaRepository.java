package com.clinica.psicologia.system.repository.clinical;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.ResultadoPrueba;

public interface ResultadoPruebaRepository extends JpaRepository<ResultadoPrueba, Integer> {

    List<ResultadoPrueba> findByPruebaPsicologicaId(Integer pruebaPsicologicaId);

    boolean existsByPruebaPsicologicaIdAndParametroIgnoreCase(Integer pruebaPsicologicaId, String parametro);

    List<ResultadoPrueba> findByPruebaPsicologicaIdOrderByParametroAsc(Integer pruebaPsicologicaId);

}