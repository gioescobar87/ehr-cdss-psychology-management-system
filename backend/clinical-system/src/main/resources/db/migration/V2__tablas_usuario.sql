-- =========================================
-- 19. Usuario
-- =========================================
CREATE TABLE usuario (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password_hash TEXT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    apellido VARCHAR(150) NOT NULL,
    correo VARCHAR(200) NOT NULL,
    id_estado INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP,

    CONSTRAINT fk_usuario_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
);

ALTER TABLE usuario
ADD CONSTRAINT uq_usuario_username UNIQUE(username);

ALTER TABLE usuario
ADD CONSTRAINT uq_usuario_correo UNIQUE(correo);

CREATE INDEX idx_usuario_nombre
ON usuario(apellido, nombre);


-- =========================================
-- 20. Usuario_Rol
-- =========================================
CREATE TABLE usuario_rol (
    id_usuario_rol INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_rol INTEGER NOT NULL,

    CONSTRAINT fk_usuario_rol_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_usuario_rol_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol(id_rol)
        ON DELETE RESTRICT
);

ALTER TABLE usuario_rol
ADD CONSTRAINT uq_usuario_rol UNIQUE(id_usuario, id_rol);


-- =========================================
-- 21. Rol_Permiso
-- =========================================
CREATE TABLE rol_permiso (
    id_rol_permiso INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_rol INTEGER NOT NULL,
    id_permiso INTEGER NOT NULL,

    CONSTRAINT fk_rol_permiso_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol(id_rol)
        ON DELETE CASCADE,

    CONSTRAINT fk_rol_permiso_permiso
        FOREIGN KEY (id_permiso)
        REFERENCES permiso(id_permiso)
        ON DELETE CASCADE
);

ALTER TABLE rol_permiso
ADD CONSTRAINT uq_rol_permiso UNIQUE(id_rol, id_permiso);
