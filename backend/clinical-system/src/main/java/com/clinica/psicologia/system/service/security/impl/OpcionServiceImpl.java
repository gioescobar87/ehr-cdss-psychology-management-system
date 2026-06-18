package com.clinica.psicologia.system.service.security.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.dto.request.security.OpcionRequestDTO;
import com.clinica.psicologia.system.dto.response.security.OpcionResponseDTO;
import com.clinica.psicologia.system.dto.response.security.OpcionTreeResponseDTO;
import com.clinica.psicologia.system.mapper.security.OpcionMapper;
import com.clinica.psicologia.system.model.catalog.Estado;
import com.clinica.psicologia.system.model.security.Modulo;
import com.clinica.psicologia.system.model.security.Opcion;
import com.clinica.psicologia.system.repository.catalog.EstadoRepository;
import com.clinica.psicologia.system.repository.security.ModuloRepository;
import com.clinica.psicologia.system.repository.security.OpcionRepository;
import com.clinica.psicologia.system.security.exception.custom.DuplicateResourceException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.security.OpcionService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class OpcionServiceImpl implements OpcionService {
    private final OpcionRepository opcionRepository;
    private final ModuloRepository moduloRepository;
    private final EstadoRepository estadoRepository;
    private final OpcionMapper opcionMapper;

    public OpcionServiceImpl(
            OpcionRepository opcionRepository,
            ModuloRepository moduloRepository,
            EstadoRepository estadoRepository,
            OpcionMapper opcionMapper) {

        this.opcionRepository = opcionRepository;
        this.moduloRepository = moduloRepository;
        this.estadoRepository = estadoRepository;
        this.opcionMapper = opcionMapper;
    }

    private Opcion findOpcion(Integer id) {

        return opcionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Option not found"));
    }

    @Override
    public List<OpcionResponseDTO> findAll() {

        return opcionMapper.toResponseDTOList(
                opcionRepository.findAll());
    }

    @Override
    public OpcionResponseDTO findById(Integer id) {

        return opcionMapper.toResponseDTO(
                findOpcion(id));
    }

    @Override
    @Transactional
    public OpcionResponseDTO create(
            OpcionRequestDTO request) {

        if (opcionRepository.existsByNombre(
                request.getNombre())) {

            throw new DuplicateResourceException(
                    "Option already exists");
        }

        Estado estado = estadoRepository
                .findById(request.getEstadoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "State not found"));

        Modulo modulo = moduloRepository
                .findById(request.getModuloId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Module not found"));

        Opcion opcionPadre = null;

        if (request.getOpcionPadreId() != null) {

            opcionPadre = opcionRepository
                    .findById(request.getOpcionPadreId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Parent option not found"));
        }

        Opcion opcion = new Opcion();

        opcion.setNombre(request.getNombre());
        opcion.setDescripcion(request.getDescripcion());

        opcion.setRutaFrontend(request.getRutaFrontend());

        opcion.setComponente(request.getComponente());

        opcion.setIcono(request.getIcono());

        opcion.setOrden(request.getOrden());

        opcion.setVisibleMenu(request.getVisibleMenu());

        opcion.setRequiereAutenticacion(request.getRequiereAutenticacion());

        opcion.setEsMenuPrincipal(request.getEsMenuPrincipal());

        opcion.setModulo(modulo);

        opcion.setOpcionPadre(opcionPadre);

        opcion.setEstado(estado);

        return opcionMapper.toResponseDTO(opcionRepository.save(opcion));
    }

    @Override
    @Transactional
    public void delete(Integer id) {

        if (opcionRepository
                .existsByOpcionPadreId(id)) {

            throw new DuplicateResourceException(
                    "Option has child options");
        }

        opcionRepository.delete(
                findOpcion(id));
    }

    @Override
    @Transactional
    public void changeStatus(
            Integer id,
            Integer estadoId) {

        Opcion opcion = opcionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Option not found"));

        Estado estado = estadoRepository.findById(
                estadoId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "State not found"));

        opcion.setEstado(estado);

        opcionRepository.save(opcion);
    }

    @Override
    public List<OpcionResponseDTO> findByModulo(
            Integer moduloId) {

        return opcionMapper.toResponseDTOList(
                opcionRepository.findByModuloId(
                        moduloId));
    }

    @Override
    public List<OpcionResponseDTO> findChildren(
            Integer opcionId) {

        return opcionMapper.toResponseDTOList(
                opcionRepository.findByOpcionPadreId(
                        opcionId));
    }

    @Override
    @Transactional
    public OpcionResponseDTO update(
            Integer id,
            OpcionRequestDTO request) {

        Opcion opcion = opcionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Option not found"));

        if (opcionRepository.existsByNombreAndIdNot(
                request.getNombre(),
                id)) {

            throw new DuplicateResourceException(
                    "Option already exists");
        }

        Estado estado = estadoRepository.findById(
                request.getEstadoId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "State not found"));

        opcion.setNombre(
                request.getNombre());

        opcion.setDescripcion(
                request.getDescripcion());

        opcion.setEstado(estado);

        return opcionMapper.toResponseDTO(
                opcionRepository.save(opcion));
    }

    @Override
    public List<OpcionTreeResponseDTO> getTree() {
        List<Opcion> opciones = opcionRepository.findAll();

        Map<Integer, OpcionTreeResponseDTO> map = new HashMap<>();

        List<OpcionTreeResponseDTO> roots = new ArrayList<>();

        for (Opcion opcion : opciones) {
            if(!Boolean.TRUE.equals(opcion.getVisibleMenu())) {
                continue;
            }

            OpcionTreeResponseDTO dto = new OpcionTreeResponseDTO();

            dto.setId(opcion.getId());
            dto.setNombre(opcion.getNombre());
            dto.setRutaFrontend(opcion.getRutaFrontend());
            dto.setIcono(opcion.getIcono());
            dto.setOrden(opcion.getOrden());
            map.put(opcion.getId(), dto);
        }

        for (Opcion opcion : opciones) {
            if(!Boolean.TRUE.equals(opcion.getVisibleMenu())) {
                continue;
            }

            OpcionTreeResponseDTO dto = map.get(opcion.getId());

            if (opcion.getOpcionPadre() == null){
                roots.add(dto);
            } else {
                OpcionTreeResponseDTO parent = map.get(opcion
                        .getOpcionPadre()
                        .getId());
                if (parent != null) {
                    parent.getChildren().add(dto);
                }
            }
        }
        roots.sort(Comparator.comparing(OpcionTreeResponseDTO::getOrden));

        roots.forEach(root ->
            root.getChildren().sort(Comparator.comparing(OpcionTreeResponseDTO::getOrden))
        );
        return roots;
    }
}
