-- ============================================================
-- EQUIPOS VIALES - DIRECCIÓN DE VIALIDAD PROVINCIAL DEL CHACO
-- Schema Supabase / PostgreSQL
-- ============================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLA: zonas
-- ============================================================
CREATE TABLE zonas (
  id SMALLINT PRIMARY KEY,
  nombre TEXT NOT NULL,
  sede TEXT NOT NULL,
  jefe TEXT,
  responsable_consorcios TEXT,
  km_totales NUMERIC(10,2)
);

INSERT INTO zonas VALUES
  (1, 'Zona I',   'Makallé',                       'Sr. Marcos Steeman',           'Sr. Luis Oscar Alvarez',      3003.68),
  (2, 'Zona II',  'Presidencia Roque Sáenz Peña',  'Ing. Marcelo Fabián Giménez',  'Ing. Raúl Gauna',             7722.14),
  (3, 'Zona III', 'Villa Ángela',                  'Ing. Víctor Leonardo López',   'Sr. Edgar Schiaffino',        8450.97),
  (4, 'Zona IV',  'J.J. Castelli',                 'Ing. Marcelo Luis Feininger',  'Sr. Adrián Rott',             8285.83),
  (5, 'Zona V',   'San Martín',                    'Ing. Tarik Fialho Flores',     'López, Héctor Fabián',        1884.68);

-- ============================================================
-- TABLA: consorcios
-- ============================================================
CREATE TABLE consorcios (
  id SMALLINT PRIMARY KEY,
  numero SMALLINT NOT NULL,
  nombre TEXT NOT NULL,
  zona_id SMALLINT NOT NULL REFERENCES zonas(id),
  km NUMERIC(8,2)
);

INSERT INTO consorcios (id, numero, nombre, zona_id, km) VALUES
-- ZONA I
(1,  5,   'Santa Elena',                    1, 356.54),
(2,  16,  'La Verde',                       1, 119.61),
(3,  22,  'Laguna Blanca - Colonia Popular',1, 156.82),
(4,  26,  'Margarita Belén',                1, 160.04),
(5,  37,  'Colonia Tacuarí Oeste',          1, 188.64),
(6,  38,  'Basail',                         1, 341.50),
(7,  40,  'Puerto Tirol',                   1, 148.06),
(8,  44,  'Cote Lai',                       1, 156.60),
(9,  45,  'Las Garcitas',                   1, 190.65),
(10, 54,  'Capitán Solari',                 1, 180.94),
(11, 62,  'Colonia Benítez',                1, 152.61),
(12, 64,  'Colonia Elisa',                  1, 206.80),
(13, 65,  'Colonia Tacuarí Este',           1, 213.08),
(14, 67,  'Tapenagá',                       1, 221.53),
(15, 102, 'Makallé',                        1, 210.26),
-- ZONA II
(16, 7,   'Quitilipi',                      2, 279.18),
(17, 9,   'Campo Largo',                    2, 354.24),
(18, 12,  'Corzuela',                       2, 477.20),
(19, 13,  'Pampa del Infierno',             2, 927.45),
(20, 15,  'La Tambora',                     2, 202.64),
(21, 24,  'Pampa Grande',                   2, 234.59),
(22, 25,  'Machagai',                       2, 458.47),
(23, 29,  'Concepción del Bermejo',         2, 283.52),
(24, 30,  'Napenay',                        2, 276.25),
(25, 36,  'Colonia Tacuruzal',              2, 209.04),
(26, 41,  'La Chiquita',                    2, 181.28),
(27, 43,  'Sáenz Peña',                     2, 301.59),
(28, 46,  'Avia Terai',                     2, 192.31),
(29, 47,  'La Matanza',                     2, 205.20),
(30, 51,  'Bajo Hondo Grande',              2, 270.85),
(31, 52,  'Bajo Hondo Chico',               2, 149.95),
(32, 53,  'Río Muerto',                     2, 549.48),
(33, 61,  'Las Tres Colonias',              2, 134.31),
(34, 68,  'La Tigra',                       2, 245.59),
(35, 69,  'Taco Pozo',                      2, 421.30),
(36, 74,  'Los Frentones',                  2, 372.48),
(37, 77,  'Colonia Aborigen',               2, 121.63),
(38, 84,  'Picada 60',                      2, 293.24),
(39, 105, 'El Palmar',                      2, 145.57),
(40, 109, 'Colonia General Paz',            2, 167.57),
(41, 110, 'La Montenegrina',                2, 267.21),
-- ZONA III
(42, 1,   'General Capdevila',              3, 136.13),
(43, 2,   'Gancedo',                        3, 307.56),
(44, 4,   'Santa Sylvina',                  3, 409.11),
(45, 8,   'Pampa Roldán',                   3, 326.77),
(46, 10,  'Mesón de Fierro',                3, 212.00),
(47, 14,  'Charata',                        3, 513.12),
(48, 17,  'Pampa Landriel',                 3, 168.02),
(49, 20,  'Chorotis',                       3, 419.84),
(50, 23,  'Coronel Du Graty',               3, 227.95),
(51, 27,  'Haumonia',                       3, 189.59),
(52, 31,  'Las Breñas',                     3, 537.67),
(53, 32,  'Villa Ángela',                   3, 256.72),
(54, 33,  'Col. Domingo Matheu',            3, 205.23),
(55, 34,  'La Clotilde',                    3, 233.70),
(56, 39,  'Enrique Urién',                  3, 402.17),
(57, 42,  'Hermoso Campo',                  3, 495.22),
(58, 48,  'Villa Berthet',                  3, 343.95),
(59, 55,  'Tres Estacas',                   3, 307.60),
(60, 56,  'General Pinedo',                 3, 421.28),
(61, 58,  'Campo del Banco',                3, 201.70),
(62, 60,  'San Bernardo',                   3, 271.22),
(63, 63,  'La Avanzada',                    3, 166.04),
(64, 71,  'Las Moreras',                    3, 194.56),
(65, 73,  'El Triángulo',                   3, 261.83),
(66, 75,  'El Ñandubay',                    3, 154.10),
(67, 76,  'Samuhú',                         3, 109.37),
(68, 87,  'Radiscok Belich',                3, 232.50),
(69, 91,  'Los Gansos',                     3, 125.15),
(70, 98,  'El Ñandubay Oeste',              3, 155.92),
(71, 113, 'Pampa Iporá Guazú',              3, 464.95),
-- ZONA IV
(72, 3,   'Tres Isletas',                   4, 490.47),
(73, 18,  'J.J. Castelli',                  4, 611.27),
(74, 21,  'Villa Río Bermejito',            4, 277.82),
(75, 49,  'Bulinky Correa',                 4, 252.08),
(76, 50,  'Las Hacheras',                   4, 380.83),
(77, 59,  'Fortín Frías',                   4, 520.51),
(78, 72,  'El Boquerón',                    4, 161.47),
(79, 78,  'Km 82 - Juana Azurduy',          4, 447.19),
(80, 79,  'Colonia La Rinconada',           4, 363.21),
(81, 80,  'La Pirámide',                    4, 349.88),
(82, 81,  'El Impenetrable',                4, 459.41),
(83, 83,  'La Cangayé',                     4, 535.33),
(84, 85,  'Miraflores',                     4, 922.68),
(85, 86,  'El Sauzalito',                   4, 317.60),
(86, 88,  'Colonia El 44',                  4, 265.38),
(87, 89,  'Raíces Chaqueñas',               4, 191.50),
(88, 90,  'El Asustado',                    4, 148.28),
(89, 95,  'Pampa Tolosa',                   4, 474.35),
(90, 100, 'Fortín Lavalle',                 4, 293.19),
(91, 101, 'Villa Fortuny',                  4, 309.16),
(92, 103, 'Fuerte Esperanza',               4, 514.22),
-- ZONA V
(93, 6,   'Selvas Río de Oro',              5, 155.48),
(94, 11,  'Zapallar Norte',                 5, 143.91),
(95, 19,  'Pampa del Indio',                5, 468.72),
(96, 28,  'Laguna Limpia',                  5, 115.26),
(97, 35,  'Costa Guaycurú',                 5, 114.61),
(98, 57,  'Presidencia Roca',               5, 165.20),
(99, 66,  'General Vedia',                  5, 132.95),
(100,70,  'La Leonesa',                     5, 200.23),
(101,96,  'La Esperanza',                   5, 138.81),
(102,99,  'Campo Winter',                   5, 112.99),
(103,108, 'La Aurora',                      5, 136.52);

-- ============================================================
-- TABLA: categorias_equipo
-- ============================================================
CREATE TABLE categorias_equipo (
  id SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre TEXT NOT NULL UNIQUE
);

INSERT INTO categorias_equipo (nombre) VALUES
  ('Tractores y Automotores'),
  ('Nivelación y Perfilado'),
  ('Implementos de Labranza'),
  ('Logística y Apoyo');

-- ============================================================
-- TABLA: tipos_equipo
-- (Catálogo maestro estandarizado - 35 tipos)
-- ============================================================
CREATE TABLE tipos_equipo (
  id SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre TEXT NOT NULL UNIQUE,
  categoria_id SMALLINT NOT NULL REFERENCES categorias_equipo(id),
  requiere_chasis_motor BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categoría 1: Tractores y Automotores
INSERT INTO tipos_equipo (nombre, categoria_id, requiere_chasis_motor) VALUES
  ('Tractor Agrícola',                    1, TRUE),
  ('Motoniveladora',                      1, TRUE),
  ('Retroexcavadora Autopropulsada',      1, TRUE),
  ('Retropala Autopropulsada',            1, TRUE),
  ('Cargador Frontal Autopropulsado',     1, TRUE),
  ('Topadora / Bulldozer',                1, TRUE),
  ('Minicargadora',                       1, TRUE),
  ('Camioneta Pick-Up',                   1, TRUE),
  ('Camión Volcador',                     1, TRUE),
  ('Camión Cisterna / Tanque',            1, TRUE),
  ('Camión Chasis',                       1, TRUE),
  ('Camión Batea',                        1, TRUE);

-- Categoría 2: Nivelación y Perfilado
INSERT INTO tipos_equipo (nombre, categoria_id, requiere_chasis_motor) VALUES
  ('Niveladora de Arrastre',              2, FALSE),
  ('Perfilador Múltiple (Ravasto)',       2, FALSE),
  ('Pala Hidráulica de Arrastre',        2, FALSE),
  ('Hoja Topante',                        2, FALSE),
  ('Retroexcavadora de Acople (p/tractor)',2, FALSE),
  ('Cargador Frontal de Acople (p/tractor)',2, FALSE);

-- Categoría 3: Implementos de Labranza
INSERT INTO tipos_equipo (nombre, categoria_id, requiere_chasis_motor) VALUES
  ('Rastra de Discos Excéntrica',        3, FALSE),
  ('Desmalezadora',                       3, FALSE),
  ('Rolo Triturador',                     3, FALSE),
  ('Rolo Liso / Compactador',            3, FALSE),
  ('Fumigadora / Pulverizadora',          3, FALSE);

-- Categoría 4: Logística y Apoyo
INSERT INTO tipos_equipo (nombre, categoria_id, requiere_chasis_motor) VALUES
  ('Tanque / Batán Combustible',         4, FALSE),
  ('Tanque / Batán Agua',                4, FALSE),
  ('Casilla Rodante',                     4, FALSE),
  ('Taller Rodante',                      4, FALSE),
  ('Acoplado Rural / Volcador',          4, FALSE),
  ('Semirremolque / Carretón',           4, FALSE),
  ('Motocicleta',                         4, TRUE),
  ('Semirremolque',                       4, TRUE);

-- ============================================================
-- TABLA: equipos
-- ============================================================
CREATE TABLE equipos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zona_id SMALLINT NOT NULL REFERENCES zonas(id),
  tipo_id SMALLINT NOT NULL REFERENCES tipos_equipo(id),

  -- Propietario
  propietario TEXT NOT NULL CHECK (propietario IN ('DVP', 'Consorcio')),
  consorcio_id SMALLINT REFERENCES consorcios(id),

  -- Identificación
  legajo TEXT,
  dominio TEXT,
  marca TEXT,
  modelo TEXT,
  anio SMALLINT,

  -- Números de identificación técnica
  n_chasis TEXT,
  n_motor TEXT,

  -- Estado operativo
  condicion TEXT NOT NULL DEFAULT 'Operativo'
    CHECK (condicion IN ('Operativo', 'En reparación', 'Fuera de servicio', 'Para baja')),
  en_servicio BOOLEAN DEFAULT TRUE,

  -- Póliza de seguro
  poliza_numero TEXT,
  poliza_vencimiento DATE,

  -- Observaciones
  observaciones TEXT,

  -- Auditoría
  creado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_equipos_zona ON equipos(zona_id);
CREATE INDEX idx_equipos_tipo ON equipos(tipo_id);
CREATE INDEX idx_equipos_consorcio ON equipos(consorcio_id);
CREATE INDEX idx_equipos_propietario ON equipos(propietario);
CREATE INDEX idx_equipos_condicion ON equipos(condicion);
CREATE INDEX idx_equipos_poliza_vto ON equipos(poliza_vencimiento);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER equipos_updated_at
  BEFORE UPDATE ON equipos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TABLA: auditoria
-- ============================================================
CREATE TABLE auditoria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipo_id UUID NOT NULL REFERENCES equipos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES auth.users(id),
  accion TEXT NOT NULL CHECK (accion IN ('crear', 'editar', 'eliminar')),
  campo_modificado TEXT,
  valor_anterior TEXT,
  valor_nuevo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_auditoria_equipo ON auditoria(equipo_id);
CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_fecha ON auditoria(created_at);

-- ============================================================
-- TABLA: perfiles (extiende auth.users de Supabase)
-- ============================================================
CREATE TABLE perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  zona_id SMALLINT REFERENCES zonas(id),
  rol TEXT NOT NULL CHECK (rol IN ('zona', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- Política: usuarios de zona ven solo su zona; admin ve todo
CREATE POLICY "zona_select_equipos" ON equipos
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM perfiles WHERE rol = 'admin'
    )
    OR
    zona_id = (SELECT zona_id FROM perfiles WHERE id = auth.uid())
  );

CREATE POLICY "zona_insert_equipos" ON equipos
  FOR INSERT WITH CHECK (
    zona_id = (SELECT zona_id FROM perfiles WHERE id = auth.uid())
    OR
    auth.uid() IN (SELECT id FROM perfiles WHERE rol = 'admin')
  );

CREATE POLICY "zona_update_equipos" ON equipos
  FOR UPDATE USING (
    zona_id = (SELECT zona_id FROM perfiles WHERE id = auth.uid())
    OR
    auth.uid() IN (SELECT id FROM perfiles WHERE rol = 'admin')
  );

CREATE POLICY "zona_delete_equipos" ON equipos
  FOR DELETE USING (
    zona_id = (SELECT zona_id FROM perfiles WHERE id = auth.uid())
    OR
    auth.uid() IN (SELECT id FROM perfiles WHERE rol = 'admin')
  );

-- Auditoría: solo lectura para zona propia; admin todo
CREATE POLICY "auditoria_select" ON auditoria
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM perfiles WHERE rol = 'admin')
    OR
    equipo_id IN (
      SELECT id FROM equipos
      WHERE zona_id = (SELECT zona_id FROM perfiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "auditoria_insert" ON auditoria
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Perfiles: cada usuario ve su propio perfil; admin ve todos
CREATE POLICY "perfiles_select" ON perfiles
  FOR SELECT USING (
    id = auth.uid()
    OR
    auth.uid() IN (SELECT id FROM perfiles WHERE rol = 'admin')
  );

-- ============================================================
-- FUNCIÓN: registrar auditoría automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION registrar_auditoria()
RETURNS TRIGGER AS $$
DECLARE
  col TEXT;
  old_val TEXT;
  new_val TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO auditoria (equipo_id, usuario_id, accion)
    VALUES (NEW.id, auth.uid(), 'crear');
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO auditoria (equipo_id, usuario_id, accion)
    VALUES (OLD.id, auth.uid(), 'eliminar');
  ELSIF TG_OP = 'UPDATE' THEN
    FOREACH col IN ARRAY ARRAY[
      'tipo_id','propietario','consorcio_id','legajo','dominio',
      'marca','modelo','anio','n_chasis','n_motor',
      'condicion','en_servicio','poliza_numero','poliza_vencimiento','observaciones'
    ] LOOP
      EXECUTE format('SELECT ($1).%I::text, ($2).%I::text', col, col)
        INTO old_val, new_val USING OLD, NEW;
      IF old_val IS DISTINCT FROM new_val THEN
        INSERT INTO auditoria (equipo_id, usuario_id, accion, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.id, auth.uid(), 'editar', col, old_val, new_val);
      END IF;
    END LOOP;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_auditoria_equipos
  AFTER INSERT OR UPDATE OR DELETE ON equipos
  FOR EACH ROW EXECUTE FUNCTION registrar_auditoria();

-- ============================================================
-- TABLAS DE LECTURA PÚBLICA (sin RLS)
-- ============================================================
ALTER TABLE zonas ENABLE ROW LEVEL SECURITY;
ALTER TABLE consorcios ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_equipo ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias_equipo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_zonas" ON zonas FOR SELECT USING (true);
CREATE POLICY "public_read_consorcios" ON consorcios FOR SELECT USING (true);
CREATE POLICY "public_read_tipos_equipo" ON tipos_equipo FOR SELECT USING (true);
CREATE POLICY "public_read_categorias" ON categorias_equipo FOR SELECT USING (true);

-- Solo admin puede modificar tipos de equipo
CREATE POLICY "admin_modify_tipos" ON tipos_equipo
  FOR ALL USING (auth.uid() IN (SELECT id FROM perfiles WHERE rol = 'admin'));
