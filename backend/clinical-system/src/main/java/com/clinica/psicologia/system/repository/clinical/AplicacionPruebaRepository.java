package com.clinica.psicologia.system.repository.clinical;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.AplicacionPrueba;

public interface AplicacionPruebaRepository extends JpaRepository<AplicacionPrueba, Integer> {

    List<AplicacionPrueba> findBySesionIdOrderByFechaAplicacionDescIdDesc(Integer sesionId);

    List<AplicacionPrueba> findByPruebaPsicologicaIdOrderByFechaAplicacionDescIdDesc(Integer pruebaPsicologicaId);

    List<AplicacionPrueba> findBySesionIdAndPruebaPsicologicaIdOrderByFechaAplicacionDescIdDesc(Integer sesionId,
            Integer pruebaPsicologicaId);
}