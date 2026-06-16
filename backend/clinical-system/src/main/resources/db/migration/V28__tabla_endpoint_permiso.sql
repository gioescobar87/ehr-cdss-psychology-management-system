-- =========================================
-- TABLE: endpoint_permiso
-- =========================================

CREATE TABLE public.endpoint_permiso (
    id SERIAL PRIMARY KEY,

    path VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,

    permiso_id INTEGER NOT NULL,

    CONSTRAINT fk_endpoint_permiso_permiso
        FOREIGN KEY (permiso_id)
        REFERENCES public.permiso (id)
        ON DELETE RESTRICT
);

-- =========================================
-- CONSTRAINTS
-- =========================================

ALTER TABLE public.endpoint_permiso
ADD CONSTRAINT uq_endpoint_permiso_path_method
UNIQUE (path, method);

-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX idx_endpoint_permiso_path
ON public.endpoint_permiso (path);

CREATE INDEX idx_endpoint_permiso_method
ON public.endpoint_permiso (method);

CREATE INDEX idx_endpoint_permiso_permiso_id
ON public.endpoint_permiso (permiso_id);