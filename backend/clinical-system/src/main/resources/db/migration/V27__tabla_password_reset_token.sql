CREATE TABLE password_reset_token (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    usuario_id INTEGER NOT NULL,

    token VARCHAR(36) NOT NULL,

    fecha_expiracion TIMESTAMP NOT NULL,

    usado BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT uq_password_reset_token_token
        UNIQUE (token),

    CONSTRAINT fk_password_reset_token_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
);

CREATE INDEX idx_password_reset_token_usuario
    ON password_reset_token(usuario_id);

CREATE INDEX idx_password_reset_token_expiracion
    ON password_reset_token(fecha_expiracion);