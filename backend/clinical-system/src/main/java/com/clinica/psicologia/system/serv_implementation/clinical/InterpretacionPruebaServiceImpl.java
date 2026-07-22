package com.clinica.psicologia.system.serv_implementation.clinical;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.InterpretacionPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.InterpretacionPruebaResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.InterpretacionPruebaMapper;
import com.clinica.psicologia.system.model.clinical.InterpretacionPrueba;
import com.clinica.psicologia.system.model.clinical.PruebaPsicologica;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.clinical.InterpretacionPruebaRepository;
import com.clinica.psicologia.system.repository.clinical.PruebaPsicologicaRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.base.CommonService;
import com.clinica.psicologia.system.service.clinical.InterpretacionPruebaService;
import com.clinica.psicologia.system.service.security.ClinicalAuthorizationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class InterpretacionPruebaServiceImpl implements InterpretacionPruebaService {

    private final InterpretacionPruebaRepository repository;
    private final PruebaPsicologicaRepository pruebaRepository;
    private final InterpretacionPruebaMapper mapper;
    private final ClinicalAuthorizationService authorizationService;
    private final CommonService common;

    @Override
    public InterpretacionPruebaResponseDTO create(InterpretacionPruebaRequestDTO dto) {

        PruebaPsicologica prueba = pruebaRepository.findById(dto.getPruebaPsicologicaId())
                .orElseThrow(() -> new ResourceNotFoundException("Psychological test not found"));

        authorizationService.validateAssignedPsychologist(prueba.getPaciente());

        validateSessionOwner(prueba);

        InterpretacionPrueba entity = new InterpretacionPrueba();

        entity.setPruebaPsicologica(prueba);
        entity.setUsuario(authorizationService.getAuthenticatedUser());
        entity.setFechaRegistro(LocalDateTime.now());
        entity.setEstado(common.getActiveState());

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<InterpretacionPruebaResponseDTO> findAll() {
        return mapper.toResponseDTOList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public InterpretacionPruebaResponseDTO findById(Integer id) {

        InterpretacionPrueba entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interpretation not found"));

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<InterpretacionPruebaResponseDTO> getByPruebaPsicologica(Integer pruebaPsicologicaId) {
        return mapper
                .toResponseDTOList(repository.findByPruebaPsicologicaIdOrderByFechaRegistroDesc(pruebaPsicologicaId));
    }

    @Override
    public InterpretacionPruebaResponseDTO update(Integer id, InterpretacionPruebaRequestDTO dto) {

        InterpretacionPrueba entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interpretation not found"));

        PruebaPsicologica prueba = pruebaRepository.findById(dto.getPruebaPsicologicaId())
                .orElseThrow(() -> new ResourceNotFoundException("Psychological test not found"));

        authorizationService.validateAssignedPsychologist(prueba.getPaciente());
        authorizationService.validateInterpretationOwner(entity);

        validateSessionOwner(prueba);

        entity.setPruebaPsicologica(prueba);

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    public void delete(Integer id) {

        InterpretacionPrueba entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interpretation not found"));

        authorizationService.validateAssignedPsychologist(entity.getPruebaPsicologica().getPaciente());

        authorizationService.validateInterpretationOwner(entity);

        validateSessionOwner(entity.getPruebaPsicologica());

        repository.delete(entity);
    }

    private void validateSessionOwner(PruebaPsicologica prueba) {

        if (prueba.getSesion() != null) {

            Usuario usuario = authorizationService.getAuthenticatedUser();

            if (!prueba.getSesion().getUsuario().getId().equals(usuario.getId())) {
                throw new BusinessRuleException(
                        "Only the psychologist who conducted the session may manage its interpretations.");
            }
        }
    }

}