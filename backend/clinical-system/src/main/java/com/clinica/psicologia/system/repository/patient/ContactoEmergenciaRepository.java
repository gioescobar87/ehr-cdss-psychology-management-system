package com.clinica.psicologia.system.repository.patient;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.psicologia.system.model.patient.ContactoEmergencia;

public interface ContactoEmergenciaRepository extends JpaRepository<ContactoEmergencia, Integer> {

    List<ContactoEmergencia> findByPacienteId(Integer id);

    boolean existsById(Integer id);
}
