-- ============================================================
-- CREAR PERFILES DE USUARIO
--
-- INSTRUCCIONES:
-- 1. Ve a Supabase -> Authentication -> Users
-- 2. Crea cada usuario con el boton "Add user"
-- 3. Copia el UUID de cada usuario creado
-- 4. Reemplaza los UUID de abajo por los reales
-- 5. Ejecuta este SQL en el Editor SQL
-- ============================================================

-- REEMPLAZA cada 'PEGAR-UUID-AQUI-ZONAX' con el UUID real del usuario

INSERT INTO perfiles (id, nombre, zona_id, rol) VALUES
  ('PEGAR-UUID-AQUI-ZONA1', 'Responsable Zona I - Makallé',                         1, 'zona'),
  ('PEGAR-UUID-AQUI-ZONA2', 'Responsable Zona II - Pcia. Roque Sáenz Peña',         2, 'zona'),
  ('PEGAR-UUID-AQUI-ZONA3', 'Responsable Zona III - Villa Ángela',                  3, 'zona'),
  ('PEGAR-UUID-AQUI-ZONA4', 'Responsable Zona IV - J.J. Castelli',                  4, 'zona'),
  ('PEGAR-UUID-AQUI-ZONA5', 'Responsable Zona V - San Martín',                      5, 'zona'),
  ('PEGAR-UUID-AQUI-ADMIN', 'Administrador DVP Chaco',                              NULL, 'admin');

-- ============================================================
-- USUARIOS A CREAR EN Authentication -> Users:
-- ============================================================
-- Email: zona1@vialidad.gob.ar  | Contraseña: Zona1_2024!
-- Email: zona2@vialidad.gob.ar  | Contraseña: Zona2_2024!
-- Email: zona3@vialidad.gob.ar  | Contraseña: Zona3_2024!
-- Email: zona4@vialidad.gob.ar  | Contraseña: Zona4_2024!
-- Email: zona5@vialidad.gob.ar  | Contraseña: Zona5_2024!
-- Email: admin@vialidad.gob.ar  | Contraseña: Admin_2024!
-- ============================================================
-- IMPORTANTE: podes usar cualquier email y contraseña que prefieras.
-- Lo importante es copiar el UUID de cada usuario despues de crearlo.
-- ============================================================
