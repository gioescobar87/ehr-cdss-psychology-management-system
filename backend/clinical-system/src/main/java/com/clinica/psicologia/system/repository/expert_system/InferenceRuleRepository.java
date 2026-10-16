package com.clinica.psicologia.system.repository.expert_system;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.clinica.psicologia.system.support_services.expert_system.DiagnosticRuleEvaluator;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class InferenceRuleRepository {

    private final JdbcTemplate jdbcTemplate;

    public Map<Integer, List<DiagnosticRuleEvaluator.Rule>> findRulesByDiagnosis() {
        String sql = """
                  SELECT dr.id AS regla_id, dr.diagnostico_id, tr.nombre AS tipo_regla, dr.valor_regla,
                      o.nombre AS operador, dr.parametro
                FROM diagnostico_regla dr
                JOIN tipo_regla tr ON tr.id = dr.tipo_regla_id
                JOIN operador o ON o.id = dr.operador_id
                ORDER BY dr.diagnostico_id, dr.tipo_regla_id, dr.parametro,
                         dr.valor_regla, dr.operador_id
                """;

        return jdbcTemplate.query(sql, resultSet -> {
            Map<Integer, List<DiagnosticRuleEvaluator.Rule>> rules = new LinkedHashMap<>();
            while (resultSet.next()) {
                rules.computeIfAbsent(resultSet.getInt("diagnostico_id"), ignored -> new ArrayList<>())
                        .add(new DiagnosticRuleEvaluator.Rule(
                            resultSet.getObject("regla_id", Integer.class),
                                resultSet.getString("tipo_regla"),
                                resultSet.getObject("valor_regla", Integer.class),
                                resultSet.getString("operador"),
                                resultSet.getString("parametro")));
            }
            return rules;
        });
    }

    public Map<Integer, List<DiagnosticRuleEvaluator.CriterionReference>> findCriterionReferencesByDiagnosis() {
        String sql = """
                SELECT diagnostico_id, criterio_clinico_id, referencia_regla
                FROM diagnostico_criterio_clinico
                ORDER BY diagnostico_id, referencia_regla, criterio_clinico_id
                """;

        return jdbcTemplate.query(sql, resultSet -> {
            Map<Integer, List<DiagnosticRuleEvaluator.CriterionReference>> references = new LinkedHashMap<>();
            while (resultSet.next()) {
                references.computeIfAbsent(resultSet.getInt("diagnostico_id"), ignored -> new ArrayList<>())
                        .add(new DiagnosticRuleEvaluator.CriterionReference(
                                resultSet.getObject("criterio_clinico_id", Integer.class),
                                resultSet.getString("referencia_regla")));
            }
            return references;
        });
    }
}