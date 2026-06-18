-- OPCIONES DEL SISTEMA

INSERT INTO Permiso (nombre, descripcion, estado_id)
SELECT 'OPCION_READ', 'Consultar opciones del sistema y menús', 1
WHERE NOT EXISTS (
    SELECT 1 FROM Permiso WHERE nombre = 'OPCION_READ'
);

INSERT INTO Permiso (nombre, descripcion, estado_id)
SELECT 'OPCION_WRITE', 'Crear y actualizar opciones del sistema y menús', 1
WHERE NOT EXISTS (
    SELECT 1 FROM Permiso WHERE nombre = 'OPCION_WRITE'
);

INSERT INTO Permiso (nombre, descripcion, estado_id)
SELECT 'OPCION_DELETE', 'Eliminar opciones del sistema y menús', 1
WHERE NOT EXISTS (
    SELECT 1 FROM Permiso WHERE nombre = 'OPCION_DELETE'
);