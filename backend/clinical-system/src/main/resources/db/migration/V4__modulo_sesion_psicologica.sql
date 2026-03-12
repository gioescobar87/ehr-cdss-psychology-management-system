-- =========================================
-- 29. Sesion
-- =========================================
CREATE TABLE sesion (
    id_sesion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_psicologo INTEGER NOT NULL,
    id_tipo_sesion INTEGER NOT NULL,
    fecha_sesion TIMESTAMP NOT NULL,
    observaciones_generales TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_sesion_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE,

    CONSTRAINT fk_sesion_psicologo
        FOREIGN KEY (id_psicologo)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT,

    CONSTRAINT fk_sesion_tipo
        FOREIGN KEY (id_tipo_sesion)
        REFERENCES tipo_sesion(id_tipo_sesion)
        ON DELETE RESTRICT,

    CONSTRAINT fk_sesion_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

CREATE INDEX idx_sesion_paciente ON sesion(id_paciente);
CREATE INDEX idx_sesion_psicologo ON sesion(id_psicologo);
CREATE INDEX idx_sesion_fecha ON sesion(fecha_sesion);



-- =========================================
-- 30. Nota_Sesion
-- =========================================
CREATE TABLE nota_sesion (
    id_nota INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sesion INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    contenido TEXT NOT NULL,
    tipo_nota VARCHAR(100),
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_nota_sesion
        FOREIGN KEY (id_sesion)
        REFERENCES sesion(id_sesion)
        ON DELETE CASCADE,

    CONSTRAINT fk_nota_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT
);

CREATE INDEX idx_nota_sesion
ON nota_sesion(id_sesion);



-- =========================================
-- 31. Diagnostico
-- =========================================
CREATE TABLE diagnostico (
    id_diagnostico INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria INTEGER NOT NULL,
    codigo_dsm VARCHAR(50),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_diagnostico_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria_diagnostica(id_categoria)
        ON DELETE RESTRICT,

    CONSTRAINT fk_diagnostico_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

CREATE UNIQUE INDEX uq_diagnostico_codigo
ON diagnostico(codigo_dsm)
WHERE codigo_dsm IS NOT NULL;



-- =========================================
-- 32. Paciente_Diagnostico
-- =========================================
CREATE TABLE paciente_diagnostico (
    id_paciente_diagnostico INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_diagnostico INTEGER NOT NULL,
    id_sesion INTEGER,
    fecha_diagnostico DATE NOT NULL,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_pac_diag_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE,

    CONSTRAINT fk_pac_diag_diagnostico
        FOREIGN KEY (id_diagnostico)
        REFERENCES diagnostico(id_diagnostico)
        ON DELETE RESTRICT,

    CONSTRAINT fk_pac_diag_sesion
        FOREIGN KEY (id_sesion)
        REFERENCES sesion(id_sesion)
        ON DELETE SET NULL,

    CONSTRAINT fk_pac_diag_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

CREATE INDEX idx_pac_diag_paciente
ON paciente_diagnostico(id_paciente);



-- =========================================
-- 33. Plan_Tratamiento
-- =========================================
CREATE TABLE plan_tratamiento (
    id_plan INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente_diagnostico INTEGER NOT NULL,
    descripcion_general TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_plan_diagnostico
        FOREIGN KEY (id_paciente_diagnostico)
        REFERENCES paciente_diagnostico(id_paciente_diagnostico)
        ON DELETE CASCADE,

    CONSTRAINT fk_plan_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado),

    CONSTRAINT chk_fechas_plan
        CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);



-- =========================================
-- 34. Objetivo_Terapia
-- =========================================
CREATE TABLE objetivo_terapia (
    id_objetivo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_plan INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_inicio DATE,
    fecha_meta DATE,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_objetivo_plan
        FOREIGN KEY (id_plan)
        REFERENCES plan_tratamiento(id_plan)
        ON DELETE CASCADE,

    CONSTRAINT fk_objetivo_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado),

    CONSTRAINT chk_fecha_objetivo
        CHECK (fecha_meta IS NULL OR fecha_meta >= fecha_inicio)
);

CREATE INDEX idx_objetivo_plan
ON objetivo_terapia(id_plan);



-- =========================================
-- 35. Seguimiento_Objetivo
-- =========================================
CREATE TABLE seguimiento_objetivo (
    id_seguimiento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_objetivo INTEGER NOT NULL,
    id_sesion INTEGER NOT NULL,
    descripcion_avance TEXT NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_seguimiento_objetivo
        FOREIGN KEY (id_objetivo)
        REFERENCES objetivo_terapia(id_objetivo)
        ON DELETE CASCADE,

    CONSTRAINT fk_seguimiento_sesion
        FOREIGN KEY (id_sesion)
        REFERENCES sesion(id_sesion)
        ON DELETE RESTRICT
);

CREATE INDEX idx_seguimiento_objetivo
ON seguimiento_objetivo(id_objetivo);



-- =========================================
-- 36. Intervencion
-- =========================================
CREATE TABLE intervencion (
    id_intervencion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_tipo_intervencion INTEGER NOT NULL,
    nombre_intervencion VARCHAR(200) NOT NULL,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_intervencion_tipo
        FOREIGN KEY (id_tipo_intervencion)
        REFERENCES tipo_intervencion(id_tipo_intervencion)
        ON DELETE RESTRICT,

    CONSTRAINT fk_intervencion_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE intervencion
ADD CONSTRAINT uq_intervencion_nombre_tipo
UNIQUE (id_tipo_intervencion, nombre_intervencion);



-- =========================================
-- 37. Sesion_Intervencion
-- =========================================
CREATE TABLE sesion_intervencion (
    id_sesion_intervencion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sesion INTEGER NOT NULL,
    id_intervencion INTEGER NOT NULL,

    CONSTRAINT fk_sesion_intervencion_sesion
        FOREIGN KEY (id_sesion)
        REFERENCES sesion(id_sesion)
        ON DELETE CASCADE,

    CONSTRAINT fk_sesion_intervencion_intervencion
        FOREIGN KEY (id_intervencion)
        REFERENCES intervencion(id_intervencion)
        ON DELETE RESTRICT
);

ALTER TABLE sesion_intervencion
ADD CONSTRAINT uq_sesion_intervencion
UNIQUE (id_sesion, id_intervencion);



-- =========================================
-- 38. Evaluacion_Riesgo
-- =========================================
CREATE TABLE evaluacion_riesgo (
    id_evaluacion_riesgo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_sesion INTEGER NOT NULL,
    id_tipo_riesgo INTEGER NOT NULL,
    id_nivel_riesgo INTEGER NOT NULL,
    observaciones TEXT,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_eval_riesgo_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE,

    CONSTRAINT fk_eval_riesgo_sesion
        FOREIGN KEY (id_sesion)
        REFERENCES sesion(id_sesion)
        ON DELETE CASCADE,

    CONSTRAINT fk_eval_riesgo_tipo
        FOREIGN KEY (id_tipo_riesgo)
        REFERENCES tipo_riesgo(id_tipo_riesgo)
        ON DELETE RESTRICT,

    CONSTRAINT fk_eval_riesgo_nivel
        FOREIGN KEY (id_nivel_riesgo)
        REFERENCES nivel_riesgo(id_nivel_riesgo)
        ON DELETE RESTRICT
);

CREATE INDEX idx_eval_riesgo_paciente
ON evaluacion_riesgo(id_paciente);

