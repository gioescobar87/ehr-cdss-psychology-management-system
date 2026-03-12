-- =========================================
-- 22. Paciente
-- =========================================
CREATE TABLE paciente (
    id_paciente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    apellido VARCHAR(150) NOT NULL,
    dpi VARCHAR(20),
    fecha_nacimiento DATE NOT NULL,
    sexo CHAR(1) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(30),
    id_estado_civil INTEGER,
    id_nivel_escolaridad INTEGER,
    ocupacion VARCHAR(150),
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_paciente_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado),

    CONSTRAINT fk_paciente_estado_civil
        FOREIGN KEY (id_estado_civil)
        REFERENCES estado_civil(id_estado_civil),

    CONSTRAINT fk_paciente_escolaridad
        FOREIGN KEY (id_nivel_escolaridad)
        REFERENCES nivel_escolaridad(id_nivel_escolaridad)
);

CREATE UNIQUE INDEX uq_paciente_dpi
ON paciente(dpi)
WHERE dpi IS NOT NULL;

ALTER TABLE paciente
ADD CONSTRAINT chk_paciente_sexo
CHECK (sexo IN ('M','F','O'));

CREATE INDEX idx_paciente_nombre
ON paciente(apellido, nombre);


-- =========================================
-- 23. Paciente_Asignacion
-- =========================================
CREATE TABLE paciente_asignacion (
    id_asignacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_psicologo INTEGER NOT NULL,
    id_usuario_cambio INTEGER,
    fecha_asignacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    motivo_asignacion TEXT,
    justificacion_reasignacion TEXT,

    CONSTRAINT fk_asignacion_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE,

    CONSTRAINT fk_asignacion_psicologo
        FOREIGN KEY (id_psicologo)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT,

    CONSTRAINT fk_asignacion_usuario_cambio
        FOREIGN KEY (id_usuario_cambio)
        REFERENCES usuario(id_usuario)
        ON DELETE SET NULL
);



-- =========================================
-- 23. Historial_Medico
-- =========================================
CREATE TABLE historial_medico (
    id_historial_medico INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_condicion INTEGER NOT NULL,
    fecha_diagnostico DATE,
    tratamiento_actual TEXT,
    observaciones TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_historial_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE,

    CONSTRAINT fk_historial_condicion
        FOREIGN KEY (id_condicion)
        REFERENCES condicion_medica(id_condicion)
        ON DELETE RESTRICT,

    CONSTRAINT fk_historial_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

CREATE INDEX idx_historial_paciente
ON historial_medico(id_paciente);



-- =========================================
-- 24. Historial_Familiar
-- =========================================
CREATE TABLE historial_familiar (
    id_historial_familiar INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_condicion INTEGER NOT NULL,
    id_parentesco INTEGER NOT NULL,
    observaciones TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_hist_fam_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE,

    CONSTRAINT fk_hist_fam_condicion
        FOREIGN KEY (id_condicion)
        REFERENCES condicion_medica(id_condicion)
        ON DELETE RESTRICT,

    CONSTRAINT fk_hist_fam_parentesco
        FOREIGN KEY (id_parentesco)
        REFERENCES parentesco(id_parentesco)
        ON DELETE RESTRICT,

    CONSTRAINT fk_hist_fam_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

CREATE INDEX idx_hist_familiar_paciente
ON historial_familiar(id_paciente);



-- =========================================
-- 25. Paciente_Medicamento
-- =========================================
CREATE TABLE paciente_medicamento (
    id_paciente_medicamento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_medicamento INTEGER NOT NULL,
    dosis VARCHAR(100),
    frecuencia VARCHAR(100),
    via_administracion VARCHAR(100),
    fecha_inicio DATE,
    fecha_fin DATE,
    prescrito_por VARCHAR(200),
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_pac_medicamento_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE,

    CONSTRAINT fk_pac_medicamento_catalogo
        FOREIGN KEY (id_medicamento)
        REFERENCES medicamento(id_medicamento)
        ON DELETE RESTRICT,

    CONSTRAINT fk_pac_medicamento_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado),

    CONSTRAINT chk_fechas_medicamento
        CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE INDEX idx_pac_medicamento_paciente
ON paciente_medicamento(id_paciente);



-- =========================================
-- 26. Nivel_Severidad_Alergias (Catálogo)
-- =========================================
CREATE TABLE nivel_severidad_alergias (
    id_nivel_severidad_alergias INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_severidad_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);



-- =========================================
-- 27. Paciente_Alergia
-- =========================================
CREATE TABLE paciente_alergia (
    id_paciente_alergia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_sustancia INTEGER NOT NULL,
    id_nivel_severidad_alergias INTEGER,
    tipo_reaccion VARCHAR(200),
    observaciones TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_pac_alergia_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE,

    CONSTRAINT fk_pac_alergia_sustancia
        FOREIGN KEY (id_sustancia)
        REFERENCES sustancia_alergena(id_sustancia)
        ON DELETE RESTRICT,

    CONSTRAINT fk_pac_alergia_severidad
        FOREIGN KEY (id_nivel_severidad_alergias)
        REFERENCES nivel_severidad_alergias(id_nivel_severidad_alergias),

    CONSTRAINT fk_pac_alergia_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE paciente_alergia
ADD CONSTRAINT uq_paciente_alergia
UNIQUE (id_paciente, id_sustancia);



-- =========================================
-- 28. Contacto_Emergencia
-- =========================================
CREATE TABLE contacto_emergencia (
    id_contacto_emergencia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    id_parentesco INTEGER,
    telefono VARCHAR(50),
    direccion TEXT,
    observaciones TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_contacto_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE,

    CONSTRAINT fk_contacto_parentesco
        FOREIGN KEY (id_parentesco)
        REFERENCES parentesco(id_parentesco),

    CONSTRAINT fk_contacto_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

CREATE INDEX idx_contacto_paciente
ON contacto_emergencia(id_paciente);
