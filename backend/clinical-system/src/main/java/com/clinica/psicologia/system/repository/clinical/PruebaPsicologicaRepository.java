package com.clinica.psicologia.system.repository.clinical;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.PruebaPsicologica;

public interface PruebaPsicologicaRepository extends JpaRepository<PruebaPsicologica, Integer> {

    List<PruebaPsicologica> findByPacienteId(Integer pacienteId);

    List<PruebaPsicologica> findBySesionId(Integer sesionId);

    List<PruebaPsicologica> findByTipoPruebaId(Integer tipoPruebaId);

    List<PruebaPsicologica> findByPacienteIdOrderByFechaAplicacionDescIdDesc(Integer pacienteId);

    List<PruebaPsicologica> findByPacienteIdOrderByFechaAplicacionDesc(Integer pacienteId);

    boolean existsByPacienteIdAndTipoPruebaIdAndFechaAplicacion(Integer pacienteId, Integer tipoPruebaId,
            LocalDate fechaAplicacion);

}