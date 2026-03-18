INSERT INTO permiso (nombre_permiso, descripcion, id_estado)
VALUES

-- =============================
-- USUARIOS
-- =============================
('USUARIO_READ','Consultar usuarios',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('USUARIO_WRITE','Crear o actualizar usuarios',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('USUARIO_DELETE','Eliminar usuarios',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

-- =============================
-- PACIENTES
-- =============================
('PACIENTE_READ','Consultar expediente clínico',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('PACIENTE_WRITE','Crear o actualizar pacientes',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('PACIENTE_DELETE','Eliminar pacientes',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('PACIENTE_REASIGNAR','Reasignar pacientes entre psicólogos',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

-- =============================
-- SESIONES CLINICAS
-- =============================
('SESION_READ','Consultar sesiones clínicas',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('SESION_WRITE','Registrar sesiones clínicas',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('SESION_DELETE','Eliminar sesiones clínicas',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

-- =============================
-- CITAS
-- =============================
('CITA_READ','Consultar agenda clínica',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('CITA_WRITE','Gestionar agenda clínica',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('CITA_DELETE','Eliminar citas',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

-- =============================
-- DIAGNOSTICO (CDSS)
-- =============================
('DIAGNOSTICO_EXECUTE','Ejecutar sistema experto',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('DIAGNOSTICO_VALIDAR','Validar consistencia diagnóstica',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

-- =============================
-- REPORTES
-- =============================
('REPORTE_READ','Consultar reportes',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

-- =============================
-- BITACORA / AUDITORIA
-- =============================
('BITACORA_READ','Consultar bitácora del sistema',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

-- =============================
-- CATALOGOS CLINICOS
-- =============================
('CATALOGO_READ','Consultar catálogos clínicos',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),
('CATALOGO_WRITE','Gestionar catálogos clínicos',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO')),

-- =============================
-- ADMINISTRACION TOTAL
-- =============================
('ADMIN_FULL','Control total del sistema',
 (SELECT id_estado FROM estado WHERE nombre_estado='ACTIVO'));