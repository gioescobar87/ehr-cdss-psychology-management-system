--------------------------------
-- CONVERT TIPO NODO INTO DIAGNOSTICO_ID
--------------------------------

BEGIN;
-- Remove tipo_nodo values
ALTER TABLE public.nodo_arbol
ALTER COLUMN tipo_nodo DROP NOT NULL;

UPDATE nodo_arbol
SET tipo_nodo = null
WHERE id <> 0;

-- Remove the old FK column
ALTER TABLE public.nodo_arbol
DROP COLUMN diagnostico_id;

-- Rename tipo_nodo to diagnostico_id
ALTER TABLE public.nodo_arbol
RENAME COLUMN tipo_nodo TO diagnostico_id;

-- Change the column type
ALTER TABLE public.nodo_arbol
ALTER COLUMN diagnostico_id TYPE integer
USING diagnostico_id::integer;

-- Add the foreign key
ALTER TABLE public.nodo_arbol
ADD CONSTRAINT fk_nodo_arbol_diagnostico
FOREIGN KEY (diagnostico_id)
REFERENCES public.diagnostico(id);

COMMIT;
