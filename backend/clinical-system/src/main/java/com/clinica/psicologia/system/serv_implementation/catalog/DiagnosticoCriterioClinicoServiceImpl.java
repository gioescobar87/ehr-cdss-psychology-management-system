package com.clinica.psicologia.system.serv_implementation.catalog;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.catalog.DiagnosticoCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.DiagnosticoCriterioClinicoResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.DiagnosticoCriterioClinicoMapper;
import com.clinica.psicologia.system.model.catalog.CriterioClinico;
import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.catalog.DiagnosticoCriterioClinico;
import com.clinica.psicologia.system.repository.catalog.CriterioClinicoRepository;
import com.clinica.psicologia.system.repository.catalog.DiagnosticoCriterioClinicoRepository;
import com.clinica.psicologia.system.repository.catalog.DiagnosticoRepository;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.catalog.DiagnosticoCriterioClinicoService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DiagnosticoCriterioClinicoServiceImpl implements DiagnosticoCriterioClinicoService {

    private final DiagnosticoCriterioClinicoRepository repository;
    private final DiagnosticoRepository diagnosticoRepository;
    private final CriterioClinicoRepository criterioClinicoRepository;
    private final DiagnosticoCriterioClinicoMapper mapper;

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<DiagnosticoCriterioClinicoResponseDTO> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public DiagnosticoCriterioClinicoResponseDTO findById(Integer id) {
        DiagnosticoCriterioClinico entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Association between diagnosis and clinical criterion not found"));

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<DiagnosticoCriterioClinicoResponseDTO> findByDiagnosticoId(Integer diagnosticoId) {
        if (!diagnosticoRepository.existsById(diagnosticoId)) {
            throw new ResourceNotFoundException("Diagnosis not found");
        }

        return mapper.toResponseList(repository.findByDiagnosticoId(diagnosticoId));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<DiagnosticoCriterioClinicoResponseDTO> findByCriterioClinicoId(Integer criterioClinicoId) {
        if (!criterioClinicoRepository.existsById(criterioClinicoId)) {
            throw new ResourceNotFoundException("Clinical criterion not found");
        }

        return mapper.toResponseList(repository.findByCriterioClinicoId(criterioClinicoId));
    }

    @Override
    public DiagnosticoCriterioClinicoResponseDTO create(DiagnosticoCriterioClinicoRequestDTO request) {
        Diagnostico diagnostico = diagnosticoRepository.findById(request.getDiagnosticoId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));

        CriterioClinico criterioClinico = criterioClinicoRepository.findById(request.getCriterioClinicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Clinical criterion not found"));

        DiagnosticoCriterioClinico entity = new DiagnosticoCriterioClinico();
        entity.setDiagnostico(diagnostico);
        entity.setCriterioClinico(criterioClinico);
        mapper.updateEntity(entity, request);

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public DiagnosticoCriterioClinicoResponseDTO update(Integer id, DiagnosticoCriterioClinicoRequestDTO request) {
        DiagnosticoCriterioClinico entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Association between diagnosis and clinical criterion not found"));

        Diagnostico diagnostico = diagnosticoRepository.findById(request.getDiagnosticoId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));

        CriterioClinico criterioClinico = criterioClinicoRepository.findById(request.getCriterioClinicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Clinical criterion not found"));

        entity.setDiagnostico(diagnostico);
        entity.setCriterioClinico(criterioClinico);
        mapper.updateEntity(entity, request);

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public void delete(Integer id) {
        DiagnosticoCriterioClinico entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Association between diagnosis and clinical criterion not found"));

        repository.delete(entity);
    }
}
