package com.clinica.psicologia.system.repository.expert_system;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.clinica.psicologia.system.model.expert_system.NodoArbol;

public interface NodoArbolRepository extends JpaRepository<NodoArbol, Integer> {

    List<NodoArbol> findByArbolDiagnosticoId(Integer arbolDiagnosticoId);

    List<NodoArbol> findByArbolDiagnosticoIdAndDiagnosticoIsNotNull(Integer arbolDiagnosticoId);

    List<NodoArbol> findByArbolDiagnosticoIdAndCriterioClinicoIsNotNull(Integer arbolDiagnosticoId);

    List<NodoArbol> findByNodoPresenteIdOrNodoAusenteId(Integer nodoPresenteId, Integer nodoAusenteId);

    boolean existsByNodoPresenteIdOrNodoAusenteId(Integer nodoPresenteId, Integer nodoAusenteId);

    @Query("""
                SELECT n
                FROM NodoArbol n
                WHERE n.arbolDiagnostico.id = :arbolId
                AND n.id NOT IN (
                    SELECT hijo.id
                    FROM NodoArbol padre
                    JOIN padre.nodoPresente hijo
                    WHERE hijo IS NOT NULL

                    UNION

                    SELECT hijo2.id
                    FROM NodoArbol padre2
                    JOIN padre2.nodoAusente hijo2
                    WHERE hijo2 IS NOT NULL
                )
            """)
    Optional<NodoArbol> findRootNode(@Param("arbolId") Integer arbolId);

    
    @Query("""
                SELECT COUNT(n)
                FROM NodoArbol n
                WHERE n.arbolDiagnostico.id = :arbolId
                AND n.id NOT IN (
                    SELECT hijo.id
                    FROM NodoArbol padre
                    JOIN padre.nodoPresente hijo

                    UNION

                    SELECT hijo2.id
                    FROM NodoArbol padre2
                    JOIN padre2.nodoAusente hijo2
                )
            """)
    long countRootNodes(@Param("arbolId") Integer arbolId);
}