-- =========================================
-- 52. Modulo
-- Representa el menú principal del sistema
-- =========================================
CREATE TABLE modulo (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(100),
    orden INTEGER NOT NULL DEFAULT 0,
    estado_id INTEGER NOT NULL,

    CONSTRAINT uq_modulo_nombre UNIQUE (nombre),

    CONSTRAINT fk_modulo_estado
        FOREIGN KEY (estado_id)
        REFERENCES estado(id)
        ON DELETE RESTRICT
);

-- Optimiza ordenamiento del sidebar
CREATE INDEX idx_modulo_orden
ON modulo(orden);



-- =========================================
-- 53. Opcion
-- Representa cada pantalla navegable
-- Soporta menús jerárquicos
-- =========================================
CREATE TABLE opcion (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    modulo_id INTEGER NOT NULL,
    opcion_padre_id INTEGER,

    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,

    -- Ruta única del frontend (React Router)
    ruta_frontend VARCHAR(250) NOT NULL,

    componente VARCHAR(150),

    icono VARCHAR(100),
    orden INTEGER NOT NULL DEFAULT 0,

    -- Determina si aparece en el menú visible
    visible_menu BOOLEAN NOT NULL DEFAULT TRUE,

    -- Permite rutas internas protegidas
    requiere_autenticacion BOOLEAN NOT NULL DEFAULT TRUE,

    -- Identifica si es raíz visual del menú
    es_menu_principal BOOLEAN NOT NULL DEFAULT FALSE,

    estado_id INTEGER NOT NULL,

    CONSTRAINT uq_opcion_ruta UNIQUE (ruta_frontend),

    CONSTRAINT fk_opcion_modulo
        FOREIGN KEY (modulo_id)
        REFERENCES modulo(id)
        ON DELETE CASCADE,

    -- Protección contra borrados accidentales
    CONSTRAINT fk_opcion_padre
        FOREIGN KEY (opcion_padre_id)
        REFERENCES opcion(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_opcion_estado
        FOREIGN KEY (estado_id)
        REFERENCES estado(id)
        ON DELETE RESTRICT
);

-- Construcción rápida del menú jerárquico
CREATE INDEX idx_opcion_modulo
ON opcion(modulo_id);

CREATE INDEX idx_opcion_padre
ON opcion(opcion_padre_id);

CREATE INDEX idx_opcion_orden
ON opcion(orden);

-- Optimización principal del sidebar
CREATE INDEX idx_opcion_modulo_orden
ON opcion(modulo_id, orden);



-- =========================================
-- 54. Rol_Opcion
-- Controla visibilidad del menú por rol
-- =========================================
CREATE TABLE rol_opcion (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    rol_id INTEGER NOT NULL,
    opcion_id INTEGER NOT NULL,

    visible BOOLEAN NOT NULL DEFAULT TRUE,

    estado_id INTEGER NOT NULL,

    CONSTRAINT uq_rol_opcion UNIQUE (rol_id, opcion_id),

    CONSTRAINT fk_rol_opcion_rol
        FOREIGN KEY (rol_id)
        REFERENCES rol(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rol_opcion_opcion
        FOREIGN KEY (opcion_id)
        REFERENCES opcion(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rol_opcion_estado
        FOREIGN KEY (estado_id)
        REFERENCES estado(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_rol_opcion_rol
ON rol_opcion(rol_id);

CREATE INDEX idx_rol_opcion_opcion
ON rol_opcion(opcion_id);

-- Optimización crítica para carga de menú al login
CREATE INDEX idx_rol_opcion_visible
ON rol_opcion(rol_id)
WHERE visible = TRUE;