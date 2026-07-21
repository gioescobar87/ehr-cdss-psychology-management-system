package com.clinica.psicologia.system.repository.clinical;

import com.clinica.psicologia.system.model.clinical.EvaluacionRiesgo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvaluacionRiesgoRepository extends JpaRepository<EvaluacionRiesgo, Integer> {

    List<EvaluacionRiesgo> findByPacienteId(Integer pacienteId);

    List<EvaluacionRiesgo> findBySesionId(Integer sesionId);

    boolean existsBySesionIdAndTipoRiesgoId(Integer sesionId, Integer tipoRiesgoId);
}