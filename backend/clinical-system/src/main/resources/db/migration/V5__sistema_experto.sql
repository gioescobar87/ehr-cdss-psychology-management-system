-- =========================================
-- 39. Arbol_Diagnostico
-- =========================================
CREATE TABLE arbol_diagnostico (
    id_arbol INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_arbol VARCHAR(100) NOT NULL,
    version INTEGER NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    id_categoria_diagnostica INTEGER NOT NULL,
    id_estado INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_arbol_categoria
        FOREIGN KEY (id_categoria_diagnostica)
        REFERENCES categoria_diagnostica(id_categoria)
        ON DELETE RESTRICT,

    CONSTRAINT fk_arbol_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
        ON DELETE RESTRICT,

    -- Garantiza versionado único del árbol
    CONSTRAINT uq_arbol_version UNIQUE (codigo_arbol, version)
);

CREATE INDEX idx_arbol_categoria
ON arbol_diagnostico(id_categoria_diagnostica);



-- =========================================
-- 40. Nodo_Arbol
-- =========================================
CREATE TABLE nodo_arbol (
    id_nodo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_arbol INTEGER NOT NULL,
    id_nodo_padre INTEGER,
    tipo_nodo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    es_terminal BOOLEAN NOT NULL DEFAULT FALSE,
    orden INTEGER,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_nodo_arbol
        FOREIGN KEY (id_arbol)
        REFERENCES arbol_diagnostico(id_arbol)
        ON DELETE CASCADE,

    CONSTRAINT fk_nodo_padre
        FOREIGN KEY (id_nodo_padre)
        REFERENCES nodo_arbol(id_nodo)
        ON DELETE CASCADE,

    CONSTRAINT fk_nodo_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
        ON DELETE RESTRICT
);

CREATE INDEX idx_nodo_arbol
ON nodo_arbol(id_arbol);



-- =========================================
-- 41. Regla_Nodo
-- =========================================
CREATE TABLE regla_nodo (
    id_regla INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_nodo_origen INTEGER NOT NULL,
    id_nodo_destino INTEGER NOT NULL,
    campo_evaluado VARCHAR(200) NOT NULL,
    operador VARCHAR(50) NOT NULL,
    valor_comparacion VARCHAR(200),
    ponderacion NUMERIC(5,2),
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_regla_origen
        FOREIGN KEY (id_nodo_origen)
        REFERENCES nodo_arbol(id_nodo)
        ON DELETE CASCADE,

    CONSTRAINT fk_regla_destino
        FOREIGN KEY (id_nodo_destino)
        REFERENCES nodo_arbol(id_nodo)
        ON DELETE CASCADE,

    CONSTRAINT fk_regla_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
        ON DELETE RESTRICT
);

CREATE INDEX idx_regla_origen
ON regla_nodo(id_nodo_origen);



-- =========================================
-- 42. Evaluacion_Diagnostica
-- =========================================
CREATE TABLE evaluacion_diagnostica (
    id_evaluacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sesion INTEGER NOT NULL,
    id_arbol INTEGER NOT NULL,
    id_diagnostico_seleccionado INTEGER,
    id_diagnostico_sugerido INTEGER,
    id_usuario INTEGER NOT NULL,
    id_nivel_consistencia INTEGER NOT NULL,
    porcentaje_coincidencia NUMERIC(5,2),
    observaciones_sistema TEXT,
    fecha_evaluacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_eval_sesion
        FOREIGN KEY (id_sesion)
        REFERENCES sesion(id_sesion)
        ON DELETE CASCADE,

    CONSTRAINT fk_eval_arbol
        FOREIGN KEY (id_arbol)
        REFERENCES arbol_diagnostico(id_arbol)
        ON DELETE RESTRICT,

    CONSTRAINT fk_eval_diag_sel
        FOREIGN KEY (id_diagnostico_seleccionado)
        REFERENCES diagnostico(id_diagnostico)
        ON DELETE SET NULL,

    CONSTRAINT fk_eval_diag_sug
        FOREIGN KEY (id_diagnostico_sugerido)
        REFERENCES diagnostico(id_diagnostico)
        ON DELETE SET NULL,

    CONSTRAINT fk_eval_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT,

    CONSTRAINT fk_eval_consistencia
        FOREIGN KEY (id_nivel_consistencia)
        REFERENCES nivel_consistencia(id_nivel_consistencia)
        ON DELETE RESTRICT,

    CONSTRAINT fk_eval_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
        ON DELETE RESTRICT,

    -- Evita porcentajes inválidos
    CONSTRAINT chk_porcentaje
        CHECK (porcentaje_coincidencia BETWEEN 0 AND 100)
);

CREATE INDEX idx_eval_sesion
ON evaluacion_diagnostica(id_sesion);
