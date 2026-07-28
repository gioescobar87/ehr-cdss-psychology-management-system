-- =====================================================
-- EVALUACION_DIAGNOSTICA_BITACORA
-- =====================================================

CREATE TABLE evaluacion_diagnostica_bitacora
(
    id                              SERIAL PRIMARY KEY,

    evaluacion_diagnostica_id        INTEGER NOT NULL,

    nodo_arbol_id                    INTEGER NOT NULL,

    regla_nodo_id                    INTEGER,

    orden_ejecucion                  INTEGER NOT NULL,

    valor_obtenido                   VARCHAR(500),

    resultado                        BOOLEAN NOT NULL,

    observacion                      TEXT,

    fecha_registro                   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_edb_evaluacion
        FOREIGN KEY (evaluacion_diagnostica_id)
        REFERENCES evaluacion_diagnostica(id),

    CONSTRAINT fk_edb_nodo
        FOREIGN KEY (nodo_arbol_id)
        REFERENCES nodo_arbol(id),

    CONSTRAINT fk_edb_regla
        FOREIGN KEY (regla_nodo_id)
        REFERENCES regla_nodo(id)
);