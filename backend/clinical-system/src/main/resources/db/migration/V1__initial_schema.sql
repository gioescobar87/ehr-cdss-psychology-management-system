CREATE TABLE system_health_check (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50),
    created_at TIMESTAMP
);