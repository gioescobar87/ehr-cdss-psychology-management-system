package com.clinica.psicologia.system.repository.expert_system;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.expert_system.ReglaNodo;

public interface ReglaNodoRepository extends JpaRepository<ReglaNodo, Integer> {

    List<ReglaNodo> findByNodoOrigenId(Integer nodoOrigenId);

    List<ReglaNodo> findByNodoDestinoId(Integer nodoDestinoId);

    List<ReglaNodo> findByNodoOrigenIdOrderById(Integer nodoOrigenId);

    boolean existsByNodoOrigenIdAndNodoDestinoId(Integer nodoOrigenId, Integer nodoDestinoId);

    boolean existsByNodoOrigenIdAndNodoDestinoIdAndIdNot(Integer nodoOrigenId, Integer nodoDestinoId, Integer id);

    boolean existsByNodoDestinoId(Integer nodoDestinoId);

    List<ReglaNodo> findByNodoOrigenIdAndEstadoIdOrderById(Integer nodoOrigenId, Integer estadoId);

    boolean existsByNodoOrigenIdAndCampoEvaluadoIgnoreCaseAndOperadorIgnoreCaseAndValorComparacionIgnoreCase(
            Integer nodoOrigenId,
            String campoEvaluado,
            String operador,
            String valorComparacion);

    boolean existsByNodoOrigenIdAndCampoEvaluadoIgnoreCaseAndOperadorIgnoreCaseAndValorComparacionIgnoreCaseAndIdNot(
            Integer nodoOrigenId,
            String campoEvaluado,
            String operador,
            String valorComparacion,
            Integer id);
}