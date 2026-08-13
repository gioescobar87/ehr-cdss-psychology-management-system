-- ============================================================
-- RENAME MODULES
-- ============================================================

update modulo m 
set nombre = 'GESTIÓN CLÍNICA'
where nombre = 'GESTION_CLINICA';

update modulo m 
set nombre = 'ADMINISTRACIÓN'
where nombre = 'ADMINISTRACION';

-- ============================================================
-- GESTIÓN CLÍNICA
-- ============================================================

-- Menú principal: GESTIÓN CLÍNICA
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
VALUES (
    2,
    NULL,
    'GESTIÓN CLÍNICA',
    'Gestión de pacientes, citas y sesiones clínicas',
    '/gestion-clinica',
    NULL,
    'medical_services',
    2,
    TRUE,
    TRUE,
    TRUE,
    1
);

-- ============================================================
-- Hijos de GESTIÓN CLÍNICA
-- ============================================================

-- Pacientes
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
VALUES (
    2,
    (
        SELECT id
        FROM opcion
        WHERE nombre = 'GESTIÓN CLÍNICA'
          AND opcion_padre_id IS NULL
        ORDER BY id DESC
        LIMIT 1
    ),
    'Pacientes',
    'Gestión de pacientes',
    '/gestion-clinica/pacientes',
    'PacientesComponent',
    'people',
    1,
    TRUE,
    TRUE,
    FALSE,
    1
);

-- Citas
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
VALUES (
    2,
    (
        SELECT id
        FROM opcion
        WHERE modulo_id = 2
          AND nombre = 'GESTIÓN CLÍNICA'
          AND opcion_padre_id IS NULL
        ORDER BY id DESC
        LIMIT 1
    ),
    'Citas',
    'Gestión de citas clínicas',
    '/gestion-clinica/citas',
    'CitasComponent',
    'event',
    2,
    TRUE,
    TRUE,
    FALSE,
    1
);

-- Sesión
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
VALUES (
    2,
    (
        SELECT id
        FROM opcion
        WHERE modulo_id = 2
          AND nombre = 'GESTIÓN CLÍNICA'
          AND opcion_padre_id IS NULL
        ORDER BY id DESC
        LIMIT 1
    ),
    'Sesión',
    'Gestión de sesiones clínicas',
    '/gestion-clinica/sesiones',
    'SesionComponent',
    'event_note',
    3,
    TRUE,
    TRUE,
    FALSE,
    1
);