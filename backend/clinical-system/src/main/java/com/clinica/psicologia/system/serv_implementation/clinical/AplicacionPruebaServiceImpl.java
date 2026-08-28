package com.clinica.psicologia.system.serv_implementation.clinical;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.clinica.psicologia.system.dto.request.clinical.AplicacionPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.AplicacionPruebaResponseDTO;
import com.clinica.psicologia.system.mapper.clinical.AplicacionPruebaMapper;
import com.clinica.psicologia.system.model.catalog.PruebaPsicologica;
import com.clinica.psicologia.system.model.clinical.AplicacionPrueba;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.patient.Paciente;
import com.clinica.psicologia.system.model.security.Usuario;
import com.clinica.psicologia.system.repository.catalog.PruebaPsicologicaRepository;
import com.clinica.psicologia.system.repository.clinical.AplicacionPruebaRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.repository.patient.PacienteRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.AplicacionPruebaService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;
import com.clinica.psicologia.system.support_services.authorization.ClinicalAuthorizationService;
import com.clinica.psicologia.system.support_services.storage.S3FileStorageService;
import com.clinica.psicologia.system.support_services.storage.S3ObjectKeyGenerator;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AplicacionPruebaServiceImpl implements AplicacionPruebaService {

    private static final String PDF_CONTENT_TYPE = "application/pdf";
    private static final long MAX_FILE_SIZE = 50L * 1024L * 1024L;

    private final AplicacionPruebaRepository repository;
    private final SesionRepository sesionRepository;
    private final PruebaPsicologicaRepository pruebaPsicologicaRepository;
    private final AplicacionPruebaMapper mapper;
    private final ClinicalAuthorizationService authorizationService;
    private final ApplicationSupportService common;
    private final PacienteRepository pacienteRepository;

    private final S3FileStorageService fileStorageService;
    private final S3ObjectKeyGenerator objectKeyGenerator;

    @Override
    public AplicacionPruebaResponseDTO create(
            AplicacionPruebaRequestDTO dto,
            MultipartFile attachment) {

        Sesion sesion = sesionRepository.findById(dto.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Session not found"));

        PruebaPsicologica pruebaPsicologica = pruebaPsicologicaRepository
                .findById(dto.getPruebaPsicologicaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Psychological test not found"));

        validateAuthorization(sesion);

        AplicacionPrueba entity = new AplicacionPrueba();

        entity.setSesion(sesion);
        entity.setPruebaPsicologica(pruebaPsicologica);
        entity.setFechaAplicacion(
                sesion.getCita()
                        .getFechaHoraInicio()
                        .toLocalDate());
        entity.setEstado(common.getActiveState());

        mapper.updateEntity(entity, dto);

        if (attachment != null && !attachment.isEmpty()) {

            String objectKey = uploadAttachment(
                    attachment,
                    sesion.getId());

            entity.setArchivoAdjunto(objectKey);
        }

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<AplicacionPruebaResponseDTO> findAll() {
        return mapper.toResponseList(repository.findAll());
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public AplicacionPruebaResponseDTO findById(Integer id) {
        AplicacionPrueba entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Test application not found"));

        return mapper.toResponseDTO(entity);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<AplicacionPruebaResponseDTO> getBySesion(
            Integer sesionId) {

        if (!sesionRepository.existsById(sesionId)) {
            throw new ResourceNotFoundException(
                    "Session not found");
        }

        return mapper.toResponseList(
                repository.findBySesionIdOrderByFechaAplicacionDescIdDesc(
                        sesionId));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<AplicacionPruebaResponseDTO> getByPruebaPsicologica(
            Integer pruebaPsicologicaId) {

        if (!pruebaPsicologicaRepository.existsById(
                pruebaPsicologicaId)) {

            throw new ResourceNotFoundException(
                    "Psychological test not found");
        }

        return mapper.toResponseList(
                repository.findByPruebaPsicologicaIdOrderByFechaAplicacionDescIdDesc(
                        pruebaPsicologicaId));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<AplicacionPruebaResponseDTO> getBySesionAndPrueba(
            Integer sesionId,
            Integer pruebaPsicologicaId) {

        if (!sesionRepository.existsById(sesionId)) {
            throw new ResourceNotFoundException(
                    "Session not found");
        }

        if (!pruebaPsicologicaRepository.existsById(
                pruebaPsicologicaId)) {

            throw new ResourceNotFoundException(
                    "Psychological test not found");
        }

        return mapper.toResponseList(
                repository
                        .findBySesionIdAndPruebaPsicologicaIdOrderByFechaAplicacionDescIdDesc(
                                sesionId,
                                pruebaPsicologicaId));
    }

    @Override
    public AplicacionPruebaResponseDTO update(
            Integer id,
            AplicacionPruebaRequestDTO dto,
            MultipartFile attachment) {

        AplicacionPrueba entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Test application not found"));

        Sesion sesion = sesionRepository.findById(dto.getSesionId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Session not found"));

        PruebaPsicologica pruebaPsicologica = pruebaPsicologicaRepository
                .findById(dto.getPruebaPsicologicaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Psychological test not found"));

        validateAuthorization(sesion);

        String previousObjectKey = entity.getArchivoAdjunto();

        entity.setSesion(sesion);
        entity.setPruebaPsicologica(pruebaPsicologica);

        mapper.updateEntity(entity, dto);

        if (attachment != null && !attachment.isEmpty()) {

            String newObjectKey = uploadAttachment(
                    attachment,
                    sesion.getId());

            entity.setArchivoAdjunto(newObjectKey);

            if (previousObjectKey != null
                    && !previousObjectKey.isBlank()
                    && !previousObjectKey.equals(newObjectKey)) {

                deleteAttachment(previousObjectKey);
            }
        }

        entity = repository.save(entity);

        return mapper.toResponseDTO(entity);
    }

    @Override
    public void delete(Integer id) {

        AplicacionPrueba entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Test application not found"));

        validateAuthorization(entity.getSesion());

        String objectKey = entity.getArchivoAdjunto();

        repository.delete(entity);

        if (objectKey != null && !objectKey.isBlank()) {
            deleteAttachment(objectKey);
        }
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<AplicacionPruebaResponseDTO> getByPaciente(
            Integer pacienteId) {

        if (!pacienteRepository.existsById(pacienteId)) {
            throw new ResourceNotFoundException(
                    "Patient not found");
        }

        return mapper.toResponseList(
                repository.findBySesionPacienteIdOrderByFechaAplicacionDescIdDesc(
                        pacienteId));
    }

    private String uploadAttachment(
            MultipartFile attachment,
            Integer sessionId) {

        validateAttachment(attachment);

        String objectKey = objectKeyGenerator.generatePsychologicalTestKey(sessionId);

        try {
            fileStorageService.store(
                    attachment.getInputStream(),
                    attachment.getSize(),
                    PDF_CONTENT_TYPE,
                    attachment.getOriginalFilename(),
                    objectKey);

            return objectKey;

        } catch (IOException exception) {
            throw new BusinessRuleException(
                    "The psychological test attachment could not be uploaded.");
        }
    }

    private void deleteAttachment(String objectKey) {
        try {
            fileStorageService.delete(objectKey);
        } catch (RuntimeException exception) {
        }
    }

    private void validateAttachment(MultipartFile attachment) {

        if (attachment == null || attachment.isEmpty()) {
            throw new BusinessRuleException(
                    "The attachment cannot be empty.");
        }

        if (attachment.getSize() > MAX_FILE_SIZE) {
            throw new BusinessRuleException(
                    "The attachment cannot exceed 50 MB.");
        }

        String contentType = attachment.getContentType();

        if (!PDF_CONTENT_TYPE.equalsIgnoreCase(contentType)) {
            throw new BusinessRuleException(
                    "Only PDF files are allowed.");
        }

        String originalFileName = attachment.getOriginalFilename();

        if (originalFileName == null
                || !originalFileName
                        .toLowerCase()
                        .endsWith(".pdf")) {

            throw new BusinessRuleException(
                    "The attachment must have a PDF extension.");
        }
    }

    private void validateAuthorization(Sesion sesion) {

        Paciente paciente = sesion.getPaciente();

        authorizationService.validateAssignedPsychologist(
                paciente);

        Usuario usuario = authorizationService.getAuthenticatedUser();

        if (!sesion.getUsuario().getId().equals(
                usuario.getId())) {

            throw new BusinessRuleException(
                    "Only the psychologist who conducted the session may manage its psychological test applications.");
        }
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public InputStreamResource getAttachment(Integer id) {
        AplicacionPrueba entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Prueba psicológica no encontrada: " + id));

        validateAuthorization(entity.getSesion());

        String objectKey = entity.getArchivoAdjunto();

        if (objectKey == null || objectKey.isBlank()) {
            throw new ResourceNotFoundException("Ningún adjunto está asociado con esta prueba psicológica.");
        }

        try {
            InputStream inputStream = fileStorageService.retrieve(objectKey);
            return new InputStreamResource(inputStream);
        } catch (RuntimeException exception) {
            throw new BusinessRuleException("No fue posible cargar la prueba psicológica asociada.");
        }
    }
}