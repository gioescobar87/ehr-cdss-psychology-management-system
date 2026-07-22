package com.clinica.psicologia.system.serv_implementation.clinical;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.clinical.ResultadoPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.ResultadoPruebaResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.ResultadoPruebaMapper;
import com.clinica.psicologia.system.model.clinical.PruebaPsicologica;
import com.clinica.psicologia.system.model.clinical.ResultadoPrueba;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.clinical.PruebaPsicologicaRepository;
import com.clinica.psicologia.system.repository.clinical.ResultadoPruebaRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.base.CommonService;
import com.clinica.psicologia.system.service.clinical.ResultadoPruebaService;
import com.clinica.psicologia.system.service.security.ClinicalAuthorizationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ResultadoPruebaServiceImpl implements ResultadoPruebaService {

    private final ResultadoPruebaRepository repository;
    private final PruebaPsicologicaRepository pruebaRepository;
    private final ResultadoPruebaMapper mapper;
    private final ClinicalAuthorizationService authorizationService;
    private final CommonService common;

    @Override
    public ResultadoPruebaResponseDTO create(ResultadoPruebaRequestDTO dto) {

        PruebaPsicologica prueba = pruebaRepository.findById(dto.getPruebaPsicologicaId())
                .orElseThrow(() -> new ResourceNotFoundException("Psychological test not found"));

        validateOwnership(prueba);

        if (repository.existsByPruebaPsicologicaIdAndParametroIgnoreCase(
                dto.getPruebaPsicologicaId(),
                dto.getParametro())) {

            throw new BusinessRuleException("This parameter already exists for the selected psychological test.");
        }

        ResultadoPrueba entity = new ResultadoPrueba();

        entity.setPruebaPsicologica(prueba);
        entity.setEstado(common.getActiveState());

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ResultadoPruebaResponseDTO> findAll() {
        return mapper.toResponseDTOList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public ResultadoPruebaResponseDTO findById(Integer id) {

        ResultadoPrueba entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test result not found"));

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ResultadoPruebaResponseDTO> getByPruebaPsicologica(Integer pruebaPsicologicaId) {
        return mapper.toResponseDTOList(repository.findByPruebaPsicologicaIdOrderByParametroAsc(pruebaPsicologicaId));
    }

    @Override
    public ResultadoPruebaResponseDTO update(Integer id, ResultadoPruebaRequestDTO dto) {

        ResultadoPrueba entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test result not found"));

        PruebaPsicologica prueba = pruebaRepository.findById(dto.getPruebaPsicologicaId())
                .orElseThrow(() -> new ResourceNotFoundException("Psychological test not found"));

        validateOwnership(prueba);

        boolean duplicate = (!entity.getPruebaPsicologica().getId().equals(dto.getPruebaPsicologicaId())
                || !entity.getParametro().equalsIgnoreCase(dto.getParametro()))
                &&
                repository.existsByPruebaPsicologicaIdAndParametroIgnoreCase(dto.getPruebaPsicologicaId(),
                        dto.getParametro());

        if (duplicate) {
            throw new BusinessRuleException("This parameter already exists for the selected psychological test.");
        }

        entity.setPruebaPsicologica(prueba);

        mapper.updateEntity(entity, dto);

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    public void delete(Integer id) {

        ResultadoPrueba entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test result not found"));

        validateOwnership(entity.getPruebaPsicologica());

        repository.delete(entity);
    }

    private void validateOwnership(PruebaPsicologica prueba) {

        authorizationService.validateAssignedPsychologist(prueba.getPaciente());

        if (prueba.getSesion() != null) {

            Usuario usuario = authorizationService.getAuthenticatedUser();

            if (!prueba.getSesion().getUsuario().getId().equals(usuario.getId())) {

                throw new BusinessRuleException(
                        "Only the psychologist who conducted the session may manage its psychological test results.");
            }
        }
    }

}