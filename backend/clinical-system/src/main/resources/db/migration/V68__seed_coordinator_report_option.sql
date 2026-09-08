INSERT INTO opcion (
    modulo_id,
    opcion_padre_id,
    nombre,
    descripcion,
    ruta_frontend,
    componente,
    icono,
    orden,
    visible_menu,
    requiere_autenticacion,
    es_menu_principal,
    estado_id
)
SELECT m.id,
       NULL,
       'Reportes',
       'Monitoreo operativo de coordinación',
       '/reportes/coordinacion',
       'CoordinatorReportComponent',
       'analytics',
       1,
       TRUE,
       TRUE,
       FALSE,
       1
FROM modulo m
WHERE m.nombre = 'REPORTES'
  AND NOT EXISTS (
      SELECT 1 FROM opcion o WHERE o.ruta_frontend = '/reportes/coordinacion'
  );

INSERT INTO rol_opcion (rol_id, opcion_id, visible, estado_id)
SELECT r.id, o.id, TRUE, 1
FROM rol r
JOIN opcion o ON o.ruta_frontend = '/reportes/coordinacion'
WHERE r.nombre = 'COORDINADOR'
  AND NOT EXISTS (
      SELECT 1 FROM rol_opcion ro WHERE ro.rol_id = r.id AND ro.opcion_id = o.id
  )
