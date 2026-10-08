-------------------------------------------
-- CLINICAL CRITERION CATEGORY
-------------------------------------------

CREATE TABLE categoria_criterio_clinico (

    id SERIAL PRIMARY KEY,

    nombre VARCHAR(150) NOT NULL,

    descripcion TEXT,

    orden INTEGER NOT NULL,

    estado_id INTEGER NOT NULL,

    CONSTRAINT fk_categoria_criterio_clinico_estado
        FOREIGN KEY (estado_id)
        REFERENCES estado(id)

);

CREATE UNIQUE INDEX uk_categoria_criterio_clinico_nombre
ON categoria_criterio_clinico(nombre);

CREATE INDEX idx_categoria_criterio_clinico_orden
ON categoria_criterio_clinico(orden);

CREATE INDEX idx_categoria_criterio_clinico_estado
ON categoria_criterio_clinico(estado_id);



-------------------------------------------
-- CLINICAL CRITERIA
-------------------------------------------

CREATE TABLE criterio_clinico (

    id SERIAL PRIMARY KEY,

    categoria_criterio_clinico_id INTEGER, --NOT NULL,

    codigo VARCHAR(50) NOT NULL,

    nombre VARCHAR(200) NOT NULL,

    descripcion TEXT,

    estado_id INTEGER NOT NULL,

    CONSTRAINT fk_criterio_clinico_categoria
        FOREIGN KEY (categoria_criterio_clinico_id)
        REFERENCES categoria_criterio_clinico(id),

    CONSTRAINT fk_criterio_clinico_estado
        FOREIGN KEY (estado_id)
        REFERENCES estado(id)

);

CREATE UNIQUE INDEX uk_criterio_clinico_codigo
ON criterio_clinico(codigo);

CREATE UNIQUE INDEX uk_criterio_clinico_nombre
ON criterio_clinico(nombre);

CREATE INDEX idx_criterio_clinico_categoria
ON criterio_clinico(categoria_criterio_clinico_id);

CREATE INDEX idx_criterio_clinico_estado
ON criterio_clinico(estado_id);



-------------------------------------------
-- CLINICAL CRITERIA FOUND DURING THE EVALUATION
-------------------------------------------

CREATE TABLE evaluacion_criterio_clinico (

    id SERIAL PRIMARY KEY,

    evaluacion_diagnostica_id INTEGER NOT NULL,

    criterio_clinico_id INTEGER NOT NULL,

    observaciones TEXT,

    CONSTRAINT fk_eval_criterio_evaluacion
        FOREIGN KEY (evaluacion_diagnostica_id)
        REFERENCES evaluacion_diagnostica(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_eval_criterio
        FOREIGN KEY (criterio_clinico_id)
        REFERENCES criterio_clinico(id),

    CONSTRAINT uk_eval_criterio
        UNIQUE (
            evaluacion_diagnostica_id,
            criterio_clinico_id
        )

);

CREATE INDEX idx_eval_criterio_evaluacion
ON evaluacion_criterio_clinico(evaluacion_diagnostica_id);

CREATE INDEX idx_eval_criterio_clinico
ON evaluacion_criterio_clinico(criterio_clinico_id);


-------------------------------------------
-- STORE FINAL DIAGNOSS
-------------------------------------------

ALTER TABLE evaluacion_diagnostica
ADD COLUMN diagnostico_id INTEGER;

ALTER TABLE evaluacion_diagnostica
ADD CONSTRAINT fk_evaluacion_diagnostica_diagnostico
FOREIGN KEY (diagnostico_id)
REFERENCES diagnostico(id);

CREATE INDEX idx_evaluacion_diagnostica_diagnostico
ON evaluacion_diagnostica(diagnostico_id);


-------------------------------------------
-- TERMINAL NODES NOW REFERENCE A DIAGNOSIS
-------------------------------------------

ALTER TABLE nodo_arbol
ADD COLUMN diagnostico_id INTEGER;

ALTER TABLE nodo_arbol
ADD CONSTRAINT fk_nodo_arbol_diagnostico
FOREIGN KEY (diagnostico_id)
REFERENCES diagnostico(id);

CREATE INDEX idx_nodo_arbol_diagnostico
ON nodo_arbol(diagnostico_id);



-------------------------------------------
-- REMOVE OLD DYNAMIC RULE STRUCTURE
-------------------------------------------

ALTER TABLE regla_nodo
DROP COLUMN campo_evaluado;

ALTER TABLE regla_nodo
DROP COLUMN operador;

ALTER TABLE regla_nodo
DROP COLUMN valor_comparacion;

ALTER TABLE regla_nodo
DROP COLUMN ponderacion;

-------------------------------------------
-- EACH RULE REFERENCES ONE CLINICAL CRITERION
-------------------------------------------

ALTER TABLE regla_nodo
ADD COLUMN criterio_clinico_id INTEGER; -- NOT NULL;

ALTER TABLE regla_nodo
ADD CONSTRAINT fk_regla_nodo_criterio_clinico
FOREIGN KEY (criterio_clinico_id)
REFERENCES criterio_clinico(id);

CREATE INDEX idx_regla_nodo_criterio
ON regla_nodo(criterio_clinico_id);