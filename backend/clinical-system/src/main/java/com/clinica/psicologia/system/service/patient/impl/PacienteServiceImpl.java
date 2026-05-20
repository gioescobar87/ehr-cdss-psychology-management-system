package com.clinica.psicologia.system.service.patient.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.patient.PacienteRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteResponseDTO;
import com.clinica.psicologia.system.mapper.patient.PacienteMapper;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.service.patient.PacienteService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PacienteServiceImpl implements PacienteService {

    private final PacienteRepository pacienteRepository;
    private final PacienteMapper pacienteMapper;

    /* =====================================================
       CREAR PACIENTE
       ===================================================== */
    @Override
    public PacienteResponseDTO crearPaciente(PacienteRequestDTO dto) {

        Paciente paciente = pacienteMapper.toEntity(dto);

        paciente = pacienteRepository.save(paciente);

        return pacienteMapper.toResponse(paciente);
    }

    /* =====================================================
       LISTAR PACIENTES
       ===================================================== */
    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PacienteResponseDTO> obtenerPacientes() {

        return pacienteRepository.findAll()
                .stream()
                .map(pacienteMapper::toResponse)
                .toList();
    }

    /* =====================================================
       OBTENER POR ID
       ===================================================== */
    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public PacienteResponseDTO obtenerPorId(Long id) {

        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Paciente no encontrado: " + id));

        return pacienteMapper.toResponse(paciente);
    }
}