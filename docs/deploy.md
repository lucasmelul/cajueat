# Deploy — Railway (Brain) + Vercel (PWA)

Runbook para poner el Brain y la PWA en internet, para que usuarios reales en distintos
dispositivos puedan usar CajuEat. Preparado para un piloto chico (2 usuarios) — no asume
una base de datos real ni un dominio propio, ambos siguen siendo decisiones de scope
explícitas (ver [PENDING-FEATURES.md](PENDING-FEATURES.md)).

## 1. Railway — `brain/`

1. En el dashboard de Railway: **New Project → Deploy from GitHub repo**, seleccioná
   `lucasmelul/cajueat` (ese es el repo real conectado a GitHub — la raíz que ve Railway
   YA es esta carpeta, no `caju_brain/` ni nada por encima).
2. **Root Directory**: `brain` (sin `cajueat/` adelante — Railway necesita esto explícito
   porque es un monorepo, no un proyecto Node en la raíz del repo). `brain/railway.json` ya
   define el build (`npm run build`) y el start (`npm run start`) — no hace falta tocar nada
   más ahí.
3. **Agregar un Volume** (Settings → Volumes → New Volume): montalo en, por ejemplo, `/data`.
   Sin esto, cada redeploy borra `catalog.json`/`memory.json`/todo lo que los usuarios cargaron
   — el filesystem del build no es persistente.
4. **Variables de entorno** (Settings → Variables), todas las de `brain/.env.example`:
   - `ANTHROPIC_API_KEY` — la que ya usás en desarrollo.
   - `ANTHROPIC_MODEL` — `claude-haiku-4-5` (o el que estés usando).
   - `ADMIN_TOKEN` — **un secreto nuevo y real**, nunca el `dev-operator-secret-change-me` local.
     Generalo con `openssl rand -hex 32` o similar.
   - `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` — las que ya generaste para push.
   - `DATA_DIR` — la ruta del Volume del paso 3 (`/data`).
   - `ALLOWED_ORIGIN` — dejalo vacío hasta tener la URL de Vercel (paso 2.4), después volvés
     acá y lo completás con esa URL exacta.
   - `PORT` — Railway lo inyecta solo, no hace falta setearlo.
5. Deploy. Railway te da una URL pública (`https://<algo>.up.railway.app`) — **anotala**, la
   necesitás para el paso 2.

**Verificación**: `curl https://<tu-url>.up.railway.app/api/restaurants -H "X-Caju-User-Id: test"`
tiene que devolver el catálogo real (6 restaurantes, `trust`/`trustRationale` calculados).

## 2. Vercel — `app/`

1. **New Project → Import** `lucasmelul/cajueat`.
2. **Root Directory**: `app` (mismo criterio que en Railway — sin `cajueat/` adelante).
   Framework preset: Vite (Vercel lo detecta solo).
3. **Variables de entorno** (Settings → Environment Variables):
   - `VITE_BRAIN_URL` = la URL de Railway del paso 1.5 (sin `/` final).
4. Deploy. Vercel te da una URL pública (`https://<algo>.vercel.app`) — volvé a Railway y
   completá `ALLOWED_ORIGIN` con esta URL exacta (paso 1.4), y hacé un redeploy del Brain para
   que tome el cambio.

`app/vercel.json` ya tiene el rewrite para que las rutas del SPA (`/conversation`,
`/restaurant/:id`, `/share`, etc.) funcionen con un link directo, no solo navegando desde `/`.

**Verificación**: abrí la URL de Vercel en el navegador — el mapa tiene que cargar
recomendaciones reales (no la respuesta mock). Si ves datos de fixture/mock, `VITE_BRAIN_URL`
no se seteó antes del build (Vite inyecta env vars en build time, no en runtime — un cambio a
esta variable requiere un redeploy, no alcanza con reiniciar).

## 3. Después del primer deploy

- **Probar con 2 dispositivos reales**: cada uno genera su propio `userId` anónimo en
  `localStorage` la primera vez que abre la app (SPEC-013) — no hace falta ninguna configuración
  extra para que estén aislados entre sí.
- **Push notifications**: requieren HTTPS (Railway/Vercel ya lo dan por defecto) y que el usuario
  acepte el permiso del navegador — nada que configurar de este lado.
- **Admin CMS** (`/admin` en la URL de Vercel): pedí el `ADMIN_TOKEN` real del paso 1.4, nunca el
  de desarrollo.

## Fuera de este alcance (decisiones de producto ya documentadas, no bloqueantes para 2 usuarios)

- SMS/WhatsApp real para "Guardá tu Brain" — sigue devolviendo el código OTP directo en la
  respuesta (decisión abierta #1 en [product-decisions.md](product-decisions.md)). No hace falta
  para que dos personas usen la app desde sus propios dispositivos, solo para no perder el
  progreso si cambian de dispositivo.
- Base de datos real en vez de JSON — ver la nota de scope en el plan original.
- Ícono real de PWA (`icons: []` en `vite.config.ts`) — sin esto, "Agregar a pantalla de inicio"
  funciona pero con un ícono genérico del navegador en vez de la marca.
