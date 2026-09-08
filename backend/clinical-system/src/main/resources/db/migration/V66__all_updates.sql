-- Formalize manual navigation adjustments already applied in dev, and align
-- the Seguridad module routes with the actual frontend routes under /administration.

UPDATE opcion
SET nombre = 'Gestión de accesos'
WHERE nombre = 'Seguridad'
  AND opcion_padre_id IS NULL;

UPDATE opcion
SET icono = 'assignment'
WHERE nombre = 'Sesiones';

UPDATE opcion
SET icono = 'event_note'
WHERE nombre = 'Agenda';

UPDATE opcion
SET ruta_frontend = '/administration/usuarios',
    componente = 'UsuarioListPage'
WHERE nombre = 'Usuarios'
  AND ruta_frontend = '/seguridad/usuarios';

UPDATE opcion
SET ruta_frontend = '/administration/roles',
    componente = 'RolListPage'
WHERE nombre = 'Roles'
  AND ruta_frontend = '/seguridad/roles';

UPDATE opcion
SET ruta_frontend = '/administration/permissions',
    componente = 'PermisoListPage'
WHERE nombre = 'Permisos'
  AND ruta_frontend = '/seguridad/permisos';

UPDATE opcion
SET ruta_frontend = '/administration/modulos',
    componente = 'ModuloListPage'
WHERE nombre = 'Módulos'
  AND ruta_frontend = '/seguridad/modulos';

UPDATE opcion
SET ruta_frontend = '/administration/opciones',
    componente = 'OpcionListPage'
WHERE nombre = 'Opciones'
  AND ruta_frontend = '/seguridad/opciones';
