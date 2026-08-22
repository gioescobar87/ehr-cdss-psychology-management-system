package com.clinica.psicologia.system.repository.clinical;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.SesionCriterioClinico;

public interface SesionCriterioClinicoRepository extends JpaRepository<SesionCriterioClinico, Integer> {

    List<SesionCriterioClinico> findBySesionIdOrderByIdAsc(Integer sesionId);

    List<SesionCriterioClinico> findBySesionPacienteIdOrderByIdAsc(Integer pacienteId);

    boolean existsBySesionIdAndCriterioClinicoId(Integer sesionId, Integer criterioClinicoId);

    Optional<SesionCriterioClinico> findBySesionIdAndCriterioClinicoId(
            Integer sesionId, Integer criterioClinicoId);
}