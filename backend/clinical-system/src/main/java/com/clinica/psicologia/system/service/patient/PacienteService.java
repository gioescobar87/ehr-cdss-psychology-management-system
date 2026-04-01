package com.clinica.psicologia.system.service.patient;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PacienteService {
    private final PacienteRepository pacienteRepository;

    public Paciente crearPaciente(){
        throw new UnsupportedOperationException();
    }

    public Paciente obtenerPaciente(Long id){
        throw new UnsupportedOperationException();
    }
}
