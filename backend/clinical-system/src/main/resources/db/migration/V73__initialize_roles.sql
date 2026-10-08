INSERT INTO rol_opcion (rol_id, opcion_id, visible, estado_id)
SELECT
    r.id,
    o.id,
    true,
    1
FROM rol r
CROSS JOIN opcion o
WHERE r.nombre = 'PSICOLOGO'
  AND o.nombre IN (
      'Gestión Clínica',
      'Pacientes',
      'Citas',
      'Sesiones'
  );


-- PSICOLOGO
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT
    r.id,
    p.id
FROM rol r
CROSS JOIN permiso p
WHERE r.nombre = 'PSICOLOGO'
  AND p.nombre IN (
      'CITA_WRITE',
      'ROL_READ',
      'USUARIO_READ',
      'MODULO_READ',
      'OPCION_READ',
      'PERMISO_READ'
  );