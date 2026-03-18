-- =============================
-- PERMISOS RECEPCIÓN
-- =============================
INSERT INTO rol (nombre_rol, descripcion, id_estado)
VALUES
('RECEPCION', 'Gestiones generales',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));

INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM rol r
JOIN permiso p ON p.nombre_permiso IN (

'PACIENTE_READ',
'PACIENTE_WRITE',
'CITA_READ',
'CITA_WRITE'

)
WHERE r.nombre_rol = 'RECEPCION';

-- =============================
-- PERMISOS PSICÓLOGO
-- =============================
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM rol r
JOIN permiso p ON p.nombre_permiso IN (

'PACIENTE_READ',
'PACIENTE_WRITE',
'SESION_READ',
'SESION_WRITE',
'CITA_READ',
'DIAGNOSTICO_EXECUTE'

)
WHERE r.nombre_rol = 'PSICOLOGO';

-- =============================
-- PERMISOS COODINADOR
-- =============================
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM rol r
JOIN permiso p ON p.nombre_permiso IN (

'PACIENTE_READ',
'PACIENTE_REASIGNAR',
'SESION_READ',
'CITA_READ',
'REPORTE_READ',
'DIAGNOSTICO_EXECUTE',
'DIAGNOSTICO_VALIDAR',
'BITACORA_READ'

)
WHERE r.nombre_rol = 'COORDINADOR';

-- =============================
-- PERMISOS ADMINISTRADOR
-- =============================
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM rol r, permiso p
WHERE r.nombre_rol = 'ADMIN';