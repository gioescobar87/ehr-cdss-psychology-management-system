-- =========================================
-- SEED DATA: AUTH MODULE
-- =========================================

INSERT INTO endpoint_permiso (path, method, permiso_id)
VALUES
('/api/auth/me', 'GET', 6),
('/api/auth/change-password', 'POST', 7),
('/api/auth/logout', 'POST', 7),
('/api/auth/logout-all', 'POST', 7);

-- =========================================
-- SEED DATA: USUARIOS
-- =========================================

INSERT INTO endpoint_permiso (path, method, permiso_id)
VALUES
('/api/usuarios', 'GET', 6),
('/api/usuarios/*', 'GET', 6),
('/api/usuarios', 'POST', 7),
('/api/usuarios/*', 'PUT', 7),
('/api/usuarios/*/estado', 'PATCH', 7),
('/api/usuarios/*', 'DELETE', 8),
('/api/usuarios/*/roles', 'GET', 6),
('/api/usuarios/*/roles', 'POST', 7),
('/api/usuarios/*/roles/*', 'DELETE', 8);

-- =========================================
-- SEED DATA: ROLES
-- =========================================

INSERT INTO endpoint_permiso (path, method, permiso_id)
VALUES
('/api/roles', 'GET', 6),
('/api/roles/*', 'GET', 6),
('/api/roles', 'POST', 24),
('/api/roles/*', 'PUT', 24),
('/api/roles/*/estado', 'PATCH', 24),
('/api/roles/*', 'DELETE', 25),
('/api/roles/*/permisos', 'GET', 23),
('/api/roles/*/permisos', 'POST', 24),
('/api/roles/*/permisos/*', 'DELETE', 25);

-- =========================================
-- SEED DATA: PACIENTES
-- =========================================

INSERT INTO endpoint_permiso (path, method, permiso_id)
VALUES
('/api/pacientes', 'GET', 9),
('/api/pacientes/*', 'GET', 9),
('/api/pacientes', 'POST', 10),
('/api/pacientes/*', 'PUT', 10),
('/api/pacientes/*', 'DELETE', 11),
('/api/pacientes/reasignar/*', 'PUT', 12);

-- =========================================
-- SEED DATA: SESIONES
-- =========================================

INSERT INTO endpoint_permiso (path, method, permiso_id)
VALUES
('/api/sesiones', 'GET', 13),
('/api/sesiones/*', 'GET', 13),
('/api/sesiones', 'POST', 14),
('/api/sesiones/*', 'PUT', 14),
('/api/sesiones/*', 'DELETE', 15);

-- =========================================
-- SEED DATA: CITAS
-- =========================================

INSERT INTO endpoint_permiso (path, method, permiso_id)
VALUES
('/api/citas', 'GET', 16),
('/api/citas/*', 'GET', 16),
('/api/citas', 'POST', 17),
('/api/citas/*', 'PUT', 17),
('/api/citas/*', 'DELETE', 18);

-- =========================================
-- SEED DATA: DIAGNOSTICO (CDSS)
-- =========================================

INSERT INTO endpoint_permiso (path, method, permiso_id)
VALUES
('/api/diagnostico/ejecutar/*', 'POST', 19),
('/api/diagnostico/validar/*', 'POST', 20);

-- =========================================
-- SEED DATA: REPORTES
-- =========================================

INSERT INTO endpoint_permiso (path, method, permiso_id)
VALUES
('/api/reportes', 'GET', 21),
('/api/reportes/*', 'GET', 21);

-- =========================================
-- SEED DATA: BITACORA
-- =========================================

INSERT INTO endpoint_permiso (path, method, permiso_id)
VALUES
('/api/bitacora', 'GET', 22),
('/api/bitacora/*', 'GET', 22);

-- =========================================
-- SEED DATA: CATALOGOS
-- =========================================

INSERT INTO endpoint_permiso (path, method, permiso_id)
VALUES
('/api/catalogos', 'GET', 23),
('/api/catalogos/*', 'GET', 23),
('/api/catalogos', 'POST', 24),
('/api/catalogos/*', 'PUT', 24);

-- =========================================
-- ADMIN OVERRIDE
-- =========================================

INSERT INTO endpoint_permiso (path, method, permiso_id)
VALUES
('/api/admin/*', 'GET', 25),
('/api/admin/*', 'POST', 25),
('/api/admin/*', 'PUT', 25),
('/api/admin/*', 'DELETE', 25);