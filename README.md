# Equipos Viales — DVP Chaco

Sistema web para la gestión y estandarización del inventario de equipos viales de la Dirección de Vialidad Provincial del Chaco.

---

## Requisitos previos

- Cuenta gratuita en [Supabase](https://supabase.com)
- Cuenta gratuita en [GitHub](https://github.com)
- Cuenta gratuita en [Vercel](https://vercel.com)
- Node.js 18 o superior instalado (solo para desarrollo local)

---

## Paso 1 — Configurar Supabase

1. Ingresá a [supabase.com](https://supabase.com) y creá un nuevo proyecto.
   - Nombre sugerido: `equipos-viales`
   - Elegí la región **South America (São Paulo)**
   - Anotá la contraseña que ingresás (no se puede recuperar después)

2. Una vez creado el proyecto, andá a **SQL Editor** y pegá el contenido completo del archivo `schema.sql`.
   - Hacé clic en **Run** para ejecutarlo.
   - Deberías ver "Success. No rows returned."

3. Andá a **Authentication → Users** y creá los 6 usuarios:

   | Email                         | Contraseña (sugerida) | Rol    | Zona |
   |-------------------------------|----------------------|--------|------|
   | zona1@vialidad.gob.ar         | Zona1_2024!          | zona   | 1    |
   | zona2@vialidad.gob.ar         | Zona2_2024!          | zona   | 2    |
   | zona3@vialidad.gob.ar         | Zona3_2024!          | zona   | 3    |
   | zona4@vialidad.gob.ar         | Zona4_2024!          | zona   | 4    |
   | zona5@vialidad.gob.ar         | Zona5_2024!          | zona   | 5    |
   | admin@vialidad.gob.ar         | Admin_2024!          | admin  | —    |

4. Después de crear cada usuario en Auth, ejecutá este SQL para registrar su perfil (reemplazá el UUID con el ID real del usuario creado):

   ```sql
   -- Ejemplo zona 1 (reemplazá 'xxxxxxxx-xxxx-...' con el UUID real de Auth)
   INSERT INTO perfiles (id, nombre, zona_id, rol)
   VALUES ('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'Responsable Zona 1', 1, 'zona');

   -- Admin
   INSERT INTO perfiles (id, nombre, zona_id, rol)
   VALUES ('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'Administrador DVP', NULL, 'admin');
   ```

   > **Tip:** El UUID de cada usuario lo encontrás en **Authentication → Users → copiar el ID**.

5. Anotá las credenciales del proyecto:
   - Andá a **Settings → API**
   - Copiá **Project URL** y **anon public key**

---

## Paso 2 — Subir el proyecto a GitHub

1. Creá un repositorio nuevo en GitHub (puede ser privado).

2. En tu computadora, abrí una terminal en la carpeta del proyecto y ejecutá:

   ```bash
   git init
   git add .
   git commit -m "Inicial: equipos viales DVP Chaco"
   git remote add origin https://github.com/TU_USUARIO/equipos-viales.git
   git push -u origin main
   ```

---

## Paso 3 — Desplegar en Vercel

1. Ingresá a [vercel.com](https://vercel.com) y conectá tu cuenta de GitHub.

2. Hacé clic en **Add New → Project** y seleccioná el repositorio `equipos-viales`.

3. En la sección **Environment Variables**, agregá:

   | Variable                          | Valor                              |
   |-----------------------------------|------------------------------------|
   | `NEXT_PUBLIC_SUPABASE_URL`        | tu Project URL de Supabase         |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | tu anon public key de Supabase     |

4. Hacé clic en **Deploy**. En ~2 minutos tenés la app en línea.

5. La URL pública será algo como: `https://equipos-viales.vercel.app`

---

## Paso 4 — Usar la aplicación

### Usuarios de zona (zona1–zona5)
- Ingresan con su email y contraseña
- Solo ven y modifican equipos de su propia zona
- Pueden registrar equipos DVP y de consorcios
- Las pólizas vencidas se muestran en **rojo** con alerta

### Administrador
- Ve el inventario completo de las 5 zonas
- Panel de resumen con métricas por zona
- Puede editar equipos de cualquier zona
- Exportar a CSV toda la información

---

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx          # Layout raíz
│   ├── page.tsx            # Dashboard de zona
│   ├── login/page.tsx      # Pantalla de login
│   ├── admin/page.tsx      # Panel administrador
│   └── equipos/
│       ├── nuevo/page.tsx  # Formulario nuevo equipo
│       └── [id]/page.tsx   # Ver/editar equipo
├── components/
│   ├── Navbar.tsx
│   ├── TablaEquipos.tsx
│   ├── FormularioEquipo.tsx
│   ├── CondicionBadge.tsx
│   ├── PolizaBadge.tsx
│   └── HistorialAuditoria.tsx
├── lib/
│   ├── types.ts            # Tipos TypeScript
│   └── supabase/
│       ├── client.ts       # Cliente browser
│       └── server.ts       # Cliente server (SSR)
└── middleware.ts           # Protección de rutas

schema.sql                  # Base de datos completa
```

---

## Desarrollo local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/equipos-viales.git
cd equipos-viales

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editá .env.local con tus credenciales de Supabase

# 4. Iniciar servidor de desarrollo
npm run dev
# Abrí http://localhost:3000
```

---

## Funcionalidades

- **Inventario estandarizado** — 35 tipos de equipo en 4 categorías
- **DVP y Consorcios** — 113 consorcios camineros cargados
- **Póliza de seguro** — alerta roja automática al vencimiento
- **Auditoría completa** — registro de quién cambió qué y cuándo
- **Exportar CSV** — con filtros aplicados
- **Seguridad** — cada zona solo ve sus propios datos (Row Level Security)
