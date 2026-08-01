package com.clinica.psicologia.system.repository.expert_system;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.expert_system.EvaluacionCriterioClinico;

public interface EvaluacionCriterioClinicoRepository extends JpaRepository<EvaluacionCriterioClinico, Integer> {

        List<EvaluacionCriterioClinico> findByEvaluacionDiagnosticaIdOrderById(Integer evaluacionDiagnosticaId);

        List<EvaluacionCriterioClinico> findByCriterioClinicoId(Integer criterioClinicoId);

        boolean existsByEvaluacionDiagnosticaIdAndCriterioClinicoId(Integer evaluacionDiagnosticaId,
                        Integer criterioClinicoId);

        boolean existsByEvaluacionDiagnosticaIdAndCriterioClinicoIdAndIdNot(Integer evaluacionDiagnosticaId,
                        Integer criterioClinicoId, Integer id);

        void deleteByEvaluacionDiagnosticaIdAndCriterioClinicoId(Integer evaluacionDiagnosticaId,
                        Integer criterioClinicoId);

        long countByEvaluacionDiagnosticaId(Integer evaluacionDiagnosticaId);
}