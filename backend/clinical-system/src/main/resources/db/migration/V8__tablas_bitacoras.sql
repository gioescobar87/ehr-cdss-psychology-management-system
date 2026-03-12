-- =========================================
-- 48. Bitacora_Auditoria
-- =========================================
CREATE TABLE bitacora_auditoria (
    id_bitacora BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER,
    entidad_afectada VARCHAR(100) NOT NULL,
    id_registro_afectado INTEGER,
    tipo_operacion VARCHAR(20) NOT NULL,
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detalle_cambios JSONB,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_bitacora_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE SET NULL,

    CONSTRAINT fk_bitacora_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
        ON DELETE RESTRICT,

    CONSTRAINT chk_tipo_operacion
        CHECK (tipo_operacion IN ('INSERT','UPDATE','DELETE'))
);

CREATE INDEX idx_bitacora_entidad
ON bitacora_auditoria(entidad_afectada);

CREATE INDEX idx_bitacora_fecha
ON bitacora_auditoria(fecha_hora);



-- =========================================
-- 49. Bitacora_Acceso
-- =========================================
CREATE TABLE bitacora_acceso (
    id_acceso BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_paciente INTEGER,
    tipo_acceso VARCHAR(50) NOT NULL,
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_estado INTEGER NOT NULL,

    CONSTRAINT fk_acceso_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_acceso_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE SET NULL,

    CONSTRAINT fk_acceso_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado(id_estado)
        ON DELETE RESTRICT
);

CREATE INDEX idx_acceso_usuario
ON bitacora_acceso(id_usuario);

CREATE INDEX idx_acceso_paciente
ON bitacora_acceso(id_paciente);

CREATE INDEX idx_acceso_fecha
ON bitacora_acceso(fecha_hora);