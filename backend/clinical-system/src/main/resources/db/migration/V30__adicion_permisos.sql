INSERT INTO permiso (nombre, descripcion, estado_id)
SELECT 'ROL_READ', 'Consultar roles', 1
WHERE NOT EXISTS (
    SELECT 1 FROM permiso WHERE nombre = 'ROL_READ'
);

INSERT INTO permiso (nombre, descripcion, estado_id)
SELECT 'ROL_WRITE', 'Crear y actualizar roles', 1
WHERE NOT EXISTS (
    SELECT 1 FROM permiso WHERE nombre = 'ROL_WRITE'
);

INSERT INTO permiso (nombre, descripcion, estado_id)
SELECT 'ROL_DELETE', 'Eliminar roles', 1
WHERE NOT EXISTS (
    SELECT 1 FROM permiso WHERE nombre = 'ROL_DELETE'
);

INSERT INTO permiso (nombre, descripcion, estado_id)
SELECT 'MODULO_READ', 'Consultar módulos y opciones', 1
WHERE NOT EXISTS (
    SELECT 1 FROM permiso WHERE nombre = 'MODULO_READ'
);

INSERT INTO permiso (nombre, descripcion, estado_id)
SELECT 'MODULO_WRITE', 'Crear y actualizar módulos y opciones', 1
WHERE NOT EXISTS (
    SELECT 1 FROM permiso WHERE nombre = 'MODULO_WRITE'
);

INSERT INTO permiso (nombre, descripcion, estado_id)
SELECT 'MODULO_DELETE', 'Eliminar módulos y opciones', 1
WHERE NOT EXISTS (
    SELECT 1 FROM permiso WHERE nombre = 'MODULO_DELETE'
);

INSERT INTO permiso (nombre, descripcion, estado_id)
SELECT 'PERMISO_READ', 'Consultar permisos del sistema', 1
WHERE NOT EXISTS (
    SELECT 1 FROM permiso WHERE nombre = 'PERMISO_READ'
);

INSERT INTO permiso (nombre, descripcion, estado_id)
SELECT 'PERMISO_WRITE', 'Crear y actualizar permisos del sistema', 1
WHERE NOT EXISTS (
    SELECT 1 FROM permiso WHERE nombre = 'PERMISO_WRITE'
);

INSERT INTO permiso (nombre, descripcion, estado_id)
SELECT 'PERMISO_DELETE', 'Eliminar permisos del sistema', 1
WHERE NOT EXISTS (
    SELECT 1 FROM permiso WHERE nombre = 'PERMISO_DELETE'
);