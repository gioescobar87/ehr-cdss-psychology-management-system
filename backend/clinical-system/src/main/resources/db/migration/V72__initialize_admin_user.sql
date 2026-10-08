-- INSERT ADMIN ROLE
INSERT INTO rol (nombre, descripcion, estado_id)
VALUES
('ADMIN', 'Administrador del sistema', 1);

-- INSERT ROLE PERMISSION RELATIONSHIP
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT
    r.id,
    p.id
FROM rol r
CROSS JOIN permiso p
WHERE r.nombre = 'ADMIN'
  AND p.nombre = 'ADMIN_FULL';

-- INSERT ADMIN USER
INSERT INTO usuario (
    username,
    password_hash,
    nombre,
    apellido,
    correo,
    estado_id,
    fecha_creacion
)
VALUES (
    'davidgescobarl',
    '$2a$10$WZjb4KElAnP1zn7YsRhjJ.YcJMJTUA1RaWldbnt9iRUA33IgvRG2O',
    'David Giovanni Jr.',
    'Escobar Lico',
    'davidgescobarl@gmail.com',
    1,
    NOW()
);

-- INSERT USER ROLE RELATIONSHIP
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT
    u.id,
    r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.username = 'davidgescobarl'
  AND r.nombre = 'ADMIN';

-- INSERT ROLE PERMISSION RELATIONSHIP
INSERT INTO rol_opcion (rol_id, opcion_id, visible, estado_id)
SELECT
    r.id,
    o.id,
    true,
    1
FROM rol r
CROSS JOIN opcion o
WHERE r.nombre = 'ADMIN'
  AND o.nombre IN (
      'Gestión de accesos',
      'Usuarios',
      'Roles',
      'Permisos',
      'Módulos',
      'Opciones'
  );