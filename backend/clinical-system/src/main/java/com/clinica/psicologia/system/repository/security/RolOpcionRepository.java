package com.clinica.psicologia.system.repository.security;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.clinica.psicologia.system.model.security.RolOpcion;

public interface RolOpcionRepository extends JpaRepository<RolOpcion, Integer> {
        List<RolOpcion> findByRolId(Integer rolId);

        boolean existsByRolIdAndOpcionId(Integer rolId, Integer opcionId);

        void deleteByRolIdAndOpcionId(Integer rolId, Integer opcionId);

        List<RolOpcion> findByRolIdIn(List<Integer> roleIds);

        @Query("""
                            SELECT DISTINCT ro
                            FROM RolOpcion ro
                                JOIN FETCH ro.opcion o
                                JOIN FETCH o.modulo m
                                JOIN FETCH ro.estado ros
                                JOIN FETCH o.estado os
                                JOIN FETCH m.estado ms
                            WHERE ro.rol.id IN :roleIds
                              AND ro.visible = true
                              AND ros.id = 1
                              AND os.id = 1
                              AND ms.id = 1
                              AND o.visibleMenu = true
                            ORDER BY m.orden, o.orden
                        """)
        List<RolOpcion> findNavigationByRoleIds(
                        @Param("roleIds") List<Integer> roleIds);
}
