-- =========================================
-- 46. Cita
-- =========================================
CREATE TABLE cita (
    id_cita INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    fecha_hora_inicio TIMESTAMP NOT NULL,
    fecha_hora_fin TIMESTAMP NOT NULL,
    motivo TEXT,
    observaciones TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_cita_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE,

    -- El psicólogo es un usuario con rol específico
    CONSTRAINT fk_cita_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT,

    CONSTRAINT fk_cita_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
        ON DELETE RESTRICT,

    CONSTRAINT chk_cita_fechas
        CHECK (fecha_hora_fin > fecha_hora_inicio)
);

CREATE INDEX idx_cita_paciente
ON cita(id_paciente);

CREATE INDEX idx_cita_usuario_fecha
ON cita(id_usuario, fecha_hora_inicio);



-- =========================================
-- 47. Cancelacion
-- =========================================
CREATE TABLE cancelacion (
    id_cancelacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_cita INTEGER NOT NULL,
    id_usuario INTEGER,
    motivo_cancelacion TEXT NOT NULL,
    fecha_cancelacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_cancelacion_cita
        FOREIGN KEY (id_cita)
        REFERENCES cita(id_cita)
        ON DELETE CASCADE,

    CONSTRAINT fk_cancelacion_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE SET NULL,

    CONSTRAINT fk_cancelacion_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
        ON DELETE RESTRICT,

    CONSTRAINT uq_cancelacion_cita UNIQUE (id_cita)
);
