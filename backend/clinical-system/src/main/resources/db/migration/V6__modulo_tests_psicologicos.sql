-- =========================================
-- 43. Prueba_Psicologica
-- =========================================
CREATE TABLE prueba_psicologica (
    id_prueba INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_sesion INTEGER,
    id_tipo_prueba INTEGER NOT NULL,
    nombre_prueba VARCHAR(200) NOT NULL,
    fecha_aplicacion DATE,
    archivo_adjunto TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_prueba_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE,

    CONSTRAINT fk_prueba_sesion
        FOREIGN KEY (id_sesion)
        REFERENCES sesion(id_sesion)
        ON DELETE SET NULL,

    CONSTRAINT fk_prueba_tipo
        FOREIGN KEY (id_tipo_prueba)
        REFERENCES tipo_prueba(id_tipo_prueba)
        ON DELETE RESTRICT,

    CONSTRAINT fk_prueba_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
        ON DELETE RESTRICT
);

CREATE INDEX idx_prueba_paciente
ON prueba_psicologica(id_paciente);



-- =========================================
-- 44. Resultado_Prueba
-- =========================================
CREATE TABLE resultado_prueba (
    id_resultado INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_prueba INTEGER NOT NULL,
    parametro VARCHAR(200) NOT NULL,
    valor VARCHAR(200),
    unidad_medida VARCHAR(50),
    observaciones TEXT,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_resultado_prueba
        FOREIGN KEY (id_prueba)
        REFERENCES prueba_psicologica(id_prueba)
        ON DELETE CASCADE,

    CONSTRAINT fk_resultado_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
        ON DELETE RESTRICT
);

CREATE INDEX idx_resultado_prueba
ON resultado_prueba(id_prueba);



-- =========================================
-- 45. Interpretacion_Prueba
-- =========================================
CREATE TABLE interpretacion_prueba (
    id_interpretacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_prueba INTEGER NOT NULL,
    id_usuario INTEGER,
    descripcion_interpretacion TEXT NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_interpretacion_prueba
        FOREIGN KEY (id_prueba)
        REFERENCES prueba_psicologica(id_prueba)
        ON DELETE CASCADE,

    CONSTRAINT fk_interpretacion_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE SET NULL,

    CONSTRAINT fk_interpretacion_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
        ON DELETE RESTRICT
);

CREATE INDEX idx_interpretacion_prueba
ON interpretacion_prueba(id_prueba);

