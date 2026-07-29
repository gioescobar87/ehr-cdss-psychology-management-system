-- id_nodo_origen -> nodo_origen_id
ALTER TABLE regla_nodo
RENAME COLUMN id_nodo_origen TO nodo_origen_id;

-- id_nodo_destino -> nodo_destino_id
ALTER TABLE regla_nodo
RENAME COLUMN id_nodo_destino TO nodo_destino_id;
