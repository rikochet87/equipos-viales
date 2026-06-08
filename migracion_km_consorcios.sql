-- Migración: agregar columna km a la tabla consorcios
-- Ejecutar en Supabase > SQL Editor

ALTER TABLE consorcios ADD COLUMN IF NOT EXISTS km INTEGER;

COMMENT ON COLUMN consorcios.km IS 'Kilómetros de red vial a cargo del consorcio';
