ALTER TABLE usuario
ADD COLUMN coordinador_id INTEGER NULL;

ALTER TABLE usuario
ADD CONSTRAINT fk_usuario_coordinador
    FOREIGN KEY (coordinador_id)
    REFERENCES usuario(id);

CREATE INDEX idx_usuario_coordinador_id
    ON usuario(coordinador_id);