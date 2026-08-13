-- ============================================================
-- ADMINISTRATION / CATALOG NAVIGATION
-- ============================================================

-- Parent option: Catálogos
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
SELECT
    m.id,
    NULL,
    'Catálogos',
    'Administración de catálogos del sistema',
    '/administration/catalogos',
    NULL,
    'category',
    1,
    TRUE,
    TRUE,
    FALSE,
    1
FROM modulo m
WHERE m.nombre = 'ADMINISTRACION'
  AND NOT EXISTS (
      SELECT 1
      FROM opcion o
      WHERE o.modulo_id = m.id
        AND o.opcion_padre_id IS NULL
        AND o.nombre = 'Catálogos'
  );


-- ============================================================
-- Catalog child options
-- ============================================================

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
SELECT
    m.id,
    parent.id,
    catalog.nombre,
    catalog.descripcion,
    catalog.ruta_frontend,
    NULL,
    catalog.icono,
    catalog.orden,
    TRUE,
    TRUE,
    FALSE,
    1
FROM modulo m
JOIN opcion parent
    ON parent.modulo_id = m.id
   AND parent.opcion_padre_id IS NULL
   AND parent.nombre = 'Catálogos'
CROSS JOIN (
    VALUES
        (
            'Categorías diagnósticas',
            'Administración de categorías diagnósticas',
            '/administration/categoria-diagnostica',
            'category',
            1
        ),
        (
            'Condiciones médicas',
            'Administración de condiciones médicas',
            '/administration/condicion-medica',
            'medical_services',
            2
        ),
        (
            'Estados civiles',
            'Administración de estados civiles',
            '/administration/estado-civil',
            'person',
            3
        ),
        (
            'Niveles de consistencia',
            'Administración de niveles de consistencia',
            '/administration/nivel-consistencia',
            'fact_check',
            4
        ),
        (
            'Niveles de escolaridad',
            'Administración de niveles de escolaridad',
            '/administration/nivel-escolaridad',
            'school',
            5
        ),
        (
            'Niveles de riesgo',
            'Administración de niveles de riesgo',
            '/administration/nivel-riesgo',
            'warning',
            6
        ),
        (
            'Niveles de severidad de alergia',
            'Administración de niveles de severidad de alergia',
            '/administration/nivel-severidad-alergia',
            'health_and_safety',
            7
        ),
        (
            'Tipos de intervención',
            'Administración de tipos de intervención',
            '/administration/tipo-intervencion',
            'psychology',
            8
        ),
        (
            'Tipos de prueba',
            'Administración de tipos de prueba psicológica',
            '/administration/tipo-prueba',
            'assignment',
            9
        ),
        (
            'Tipos de riesgo',
            'Administración de tipos de riesgo',
            '/administration/tipo-riesgo',
            'crisis_alert',
            10
        ),
        (
            'Tipos de sesión',
            'Administración de tipos de sesión clínica',
            '/administration/tipo-sesion',
            'event_note',
            11
        ),
        (
            'Tipos de sustancia alergénica',
            'Administración de tipos de sustancia alergénica',
            '/administration/tipo-sustancia-alergena',
            'medication',
            12
        ),
        (
            'Categorías de criterios clínicos',
            'Administración de categorías de criterios clínicos',
            '/administration/categoria-criterio-clinico',
            'rule',
            13
        )
) AS catalog(
    nombre,
    descripcion,
    ruta_frontend,
    icono,
    orden
)
WHERE m.nombre = 'ADMINISTRACION'
  AND NOT EXISTS (
      SELECT 1
      FROM opcion existing
      WHERE existing.modulo_id = m.id
        AND existing.opcion_padre_id = parent.id
        AND existing.ruta_frontend = catalog.ruta_frontend
  );