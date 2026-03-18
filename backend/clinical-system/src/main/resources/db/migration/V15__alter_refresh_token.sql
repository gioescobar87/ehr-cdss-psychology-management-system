ALTER TABLE refresh_token
ALTER COLUMN id_refresh_token TYPE BIGINT;

ALTER SEQUENCE refresh_token_id_refresh_token_seq
AS BIGINT;