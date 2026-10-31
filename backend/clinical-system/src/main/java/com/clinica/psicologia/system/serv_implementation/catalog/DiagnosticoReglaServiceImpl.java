package com.clinica.psicologia.system.serv_implementation.catalog;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.DiagnosticoReglaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.DiagnosticoReglaResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.DiagnosticoReglaMapper;
import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.catalog.DiagnosticoRegla;
import com.clinica.psicologia.system.model.catalog.Operador;
import com.clinica.psicologia.system.model.catalog.TipoRegla;
import com.clinica.psicologia.system.repository.catalog.DiagnosticoReglaRepository;
import com.clinica.psicologia.system.repository.catalog.DiagnosticoRepository;
import com.clinica.psicologia.system.repository.catalog.OperadorRepository;
import com.clinica.psicologia.system.repository.catalog.TipoReglaRepository;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.catalog.DiagnosticoReglaService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DiagnosticoReglaServiceImpl implements DiagnosticoReglaService {

    private final DiagnosticoReglaRepository repository;
    private final DiagnosticoRepository diagnosticoRepository;
    private final TipoReglaRepository tipoReglaRepository;
    private final OperadorRepository operadorRepository;
    private final DiagnosticoReglaMapper mapper;

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<DiagnosticoReglaResponseDTO> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public DiagnosticoReglaResponseDTO findById(Integer id) {
        DiagnosticoRegla entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic rule not found"));

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<DiagnosticoReglaResponseDTO> findByDiagnosticoId(Integer diagnosticoId) {
        if (!diagnosticoRepository.existsById(diagnosticoId)) {
            throw new ResourceNotFoundException("Diagnosis not found");
        }

        return mapper.toResponseList(repository.findByDiagnosticoId(diagnosticoId));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<DiagnosticoReglaResponseDTO> findByTipoReglaId(Integer tipoReglaId) {
        if (!tipoReglaRepository.existsById(tipoReglaId)) {
            throw new ResourceNotFoundException("Rule type not found");
        }

        return mapper.toResponseList(repository.findByTipoReglaId(tipoReglaId));
    }

    @Override
    public DiagnosticoReglaResponseDTO create(DiagnosticoReglaRequestDTO request) {
        Diagnostico diagnostico = diagnosticoRepository.findById(request.getDiagnosticoId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));

        TipoRegla tipoRegla = tipoReglaRepository.findById(request.getTipoReglaId())
                .orElseThrow(() -> new ResourceNotFoundException("Rule type not found"));

        Operador operador = operadorRepository.findById(request.getOperadorId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found"));

        DiagnosticoRegla entity = new DiagnosticoRegla();
        entity.setDiagnostico(diagnostico);
        entity.setTipoRegla(tipoRegla);
        entity.setOperador(operador);
        mapper.updateEntity(entity, request);

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public DiagnosticoReglaResponseDTO update(Integer id, DiagnosticoReglaRequestDTO request) {
        DiagnosticoRegla entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic rule not found"));

        Diagnostico diagnostico = diagnosticoRepository.findById(request.getDiagnosticoId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));

        TipoRegla tipoRegla = tipoReglaRepository.findById(request.getTipoReglaId())
                .orElseThrow(() -> new ResourceNotFoundException("Rule type not found"));

        Operador operador = operadorRepository.findById(request.getOperadorId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found"));

        entity.setDiagnostico(diagnostico);
        entity.setTipoRegla(tipoRegla);
        entity.setOperador(operador);
        mapper.updateEntity(entity, request);

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public void delete(Integer id) {
        DiagnosticoRegla entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic rule not found"));

        repository.delete(entity);
    }
}
