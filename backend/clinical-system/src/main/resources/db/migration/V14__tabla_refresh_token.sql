CREATE TABLE refresh_token (
    id_refresh_token SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuario(id_usuario),
    token VARCHAR(255) UNIQUE NOT NULL,
    expiration TIMESTAMP NOT NULL
);