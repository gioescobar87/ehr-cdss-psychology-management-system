package com.clinica.psicologia.system.repository.clinical;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.clinical.SesionIntervencion;

public interface SesionIntervencionRepository extends JpaRepository<SesionIntervencion, Integer> {
    List<SesionIntervencion> findBySesionIdOrderByIdAsc(Integer sesionId);

    boolean existsBySesionIdAndIntervencionId(Integer sesionId, Integer intervencionId);

    List<SesionIntervencion> findBySesionIdOrderByIntervencionNombreAsc(Integer sesionId);

    List<SesionIntervencion> findBySesionPacienteIdOrderByIntervencionNombreAsc(Integer pacienteId);
}
