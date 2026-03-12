-- =========================================
-- 1. Estado
-- =========================================
CREATE TABLE estado (
    id_estado INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_estado VARCHAR(100) NOT NULL,
    descripcion TEXT
);

ALTER TABLE estado
ADD CONSTRAINT uq_estado_nombre UNIQUE(nombre_estado);


-- =========================================
-- 2. Rol
-- =========================================
CREATE TABLE rol (
    id_rol INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_rol VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_rol_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE rol
ADD CONSTRAINT uq_rol_nombre UNIQUE(nombre_rol);


-- =========================================
-- 3. Permiso
-- =========================================
CREATE TABLE permiso (
    id_permiso INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_permiso VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_permiso_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE permiso
ADD CONSTRAINT uq_permiso_nombre UNIQUE(nombre_permiso);


-- =========================================
-- 4. Categoria_Diagnostica
-- =========================================
CREATE TABLE categoria_diagnostica (
    id_categoria INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_categoria VARCHAR(150) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_categoria_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE categoria_diagnostica
ADD CONSTRAINT uq_categoria_nombre UNIQUE(nombre_categoria);


-- =========================================
-- 5. Nivel_Consistencia
-- =========================================
CREATE TABLE nivel_consistencia (
    id_nivel_consistencia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_nivel VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_nivel_consistencia_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE nivel_consistencia
ADD CONSTRAINT uq_nivel_consistencia UNIQUE(nombre_nivel);


-- =========================================
-- 6. Tipo_Prueba
-- =========================================
CREATE TABLE tipo_prueba (
    id_tipo_prueba INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_tipo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_tipo_prueba_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE tipo_prueba
ADD CONSTRAINT uq_tipo_prueba_nombre UNIQUE(nombre_tipo);


-- =========================================
-- 7. Tipo_Riesgo
-- =========================================
CREATE TABLE tipo_riesgo (
    id_tipo_riesgo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_tipo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_tipo_riesgo_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE tipo_riesgo
ADD CONSTRAINT uq_tipo_riesgo UNIQUE(nombre_tipo);


-- =========================================
-- 8. Nivel_Riesgo
-- =========================================
CREATE TABLE nivel_riesgo (
    id_nivel_riesgo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_nivel VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_nivel_riesgo_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE nivel_riesgo
ADD CONSTRAINT uq_nivel_riesgo UNIQUE(nombre_nivel);


-- =========================================
-- 9. Estado_Cita
-- =========================================
CREATE TABLE estado_cita (
    id_estado_cita INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_estado VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_estado_cita_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE estado_cita
ADD CONSTRAINT uq_estado_cita_nombre UNIQUE(nombre_estado);


-- =========================================
-- 10. Condicion_Medica
-- =========================================
CREATE TABLE condicion_medica (
    id_condicion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_condicion VARCHAR(200) NOT NULL,
    codigo_referencia VARCHAR(50),
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_condicion_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

CREATE UNIQUE INDEX uq_condicion_nombre
ON condicion_medica (LOWER(nombre_condicion));


-- =========================================
-- 11. Parentesco
-- =========================================
CREATE TABLE parentesco (
    id_parentesco INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_parentesco VARCHAR(100) NOT NULL,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_parentesco_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE parentesco
ADD CONSTRAINT uq_parentesco_nombre UNIQUE(nombre_parentesco);


-- =========================================
-- 12. Medicamento
-- =========================================
CREATE TABLE medicamento (
    id_medicamento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_generico VARCHAR(200) NOT NULL,
    nombre_comercial VARCHAR(200),
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_medicamento_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

CREATE UNIQUE INDEX uq_medicamento_generico
ON medicamento (LOWER(nombre_generico));


-- =========================================
-- 13. Tipo_Sustancia_Alergena
-- =========================================
CREATE TABLE tipo_sustancia_alergena (
    id_tipo_sustancia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_tipo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_tipo_sustancia_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE tipo_sustancia_alergena
ADD CONSTRAINT uq_tipo_sustancia_nombre UNIQUE(nombre_tipo);


-- =========================================
-- 14. Sustancia_Alergena
-- =========================================
CREATE TABLE sustancia_alergena (
    id_sustancia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_sustancia VARCHAR(200) NOT NULL,
    id_tipo_sustancia INTEGER NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_sustancia_tipo
        FOREIGN KEY (id_tipo_sustancia)
        REFERENCES tipo_sustancia_alergena(id_tipo_sustancia),

    CONSTRAINT fk_sustancia_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

CREATE UNIQUE INDEX uq_sustancia_nombre
ON sustancia_alergena (LOWER(nombre_sustancia));


-- =========================================
-- 15. Tipo_Intervencion
-- =========================================
CREATE TABLE tipo_intervencion (
    id_tipo_intervencion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_tipo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_tipo_intervencion_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE tipo_intervencion
ADD CONSTRAINT uq_tipo_intervencion_nombre UNIQUE(nombre_tipo);


-- =========================================
-- 16. Tipo_Sesion
-- =========================================
CREATE TABLE tipo_sesion (
    id_tipo_sesion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_tipo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_tipo_sesion_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE tipo_sesion
ADD CONSTRAINT uq_tipo_sesion_nombre UNIQUE(nombre_tipo);


-- =========================================
-- 17. Estado_Civil
-- =========================================
CREATE TABLE estado_civil (
    id_estado_civil INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_estado_civil VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_estado_civil_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE estado_civil
ADD CONSTRAINT uq_estado_civil UNIQUE(nombre_estado_civil);


-- =========================================
-- 18. Nivel_Escolaridad
-- =========================================
CREATE TABLE nivel_escolaridad (
    id_nivel_escolaridad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_nivel VARCHAR(150) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_escolaridad_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE nivel_escolaridad
ADD CONSTRAINT uq_escolaridad UNIQUE(nombre_nivel);
