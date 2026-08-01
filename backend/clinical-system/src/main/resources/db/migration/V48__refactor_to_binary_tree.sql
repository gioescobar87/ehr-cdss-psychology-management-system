-- DROP EXISTING NODO ARBOL DATA
TRUNCATE TABLE nodo_arbol CASCADE;

-- REMOVE REGLA NODO TABLE
DROP TABLE IF EXISTS regla_nodo CASCADE;

-- REFACTOR NODO ARBOL TABLE
ALTER TABLE nodo_arbol

DROP COLUMN nodo_arbol_id,

ADD COLUMN criterio_clinico_id INTEGER,

ADD COLUMN criterio_presente_nodo_id INTEGER,

ADD COLUMN criterio_ausente_nodo_id INTEGER;

-- ADD FKS
ALTER TABLE nodo_arbol
ADD CONSTRAINT fk_nodo_arbol_criterio
FOREIGN KEY (criterio_clinico_id)
REFERENCES criterio_clinico(id);

ALTER TABLE nodo_arbol
ADD CONSTRAINT fk_nodo_arbol_destino_si
FOREIGN KEY (criterio_presente_nodo_id)
REFERENCES nodo_arbol(id);

ALTER TABLE nodo_arbol
ADD CONSTRAINT fk_nodo_arbol_destino_no
FOREIGN KEY (criterio_ausente_nodo_id)
REFERENCES nodo_arbol(id);

-- ADDITIONAL VALIDATION CHECKS
ALTER TABLE nodo_arbol
ADD CONSTRAINT chk_nodo_tipo
CHECK (

    (
        diagnostico_id IS NULL
        AND criterio_clinico_id IS NOT NULL
    )

    OR

    (
        diagnostico_id IS NOT NULL
        AND criterio_clinico_id IS NULL
    )
);

-- PREVENT INFINITE LOOP
ALTER TABLE nodo_arbol
ADD CONSTRAINT chk_nodo_destino_si
CHECK (
    criterio_presente_nodo_id IS NULL
    OR criterio_presente_nodo_id <> id
);

ALTER TABLE nodo_arbol
ADD CONSTRAINT chk_nodo_destino_no
CHECK (
    criterio_ausente_nodo_id IS NULL
    OR criterio_ausente_nodo_id <> id
);