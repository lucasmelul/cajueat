# SPEC-024 — Contenido de Instagram en el Perfil + Indicador de Novedad en el Mapa (nueva)

**Status:** Draft — alcance recortado por restricciones reales de la API de Instagram, ver abajo
**Priority:** P3
**Owner:** Claude Code
**Consumers:** Claude Code

Depends On

- SPEC-003 Restaurant Experience
- SPEC-001 Living Map

---

# Objetivo

Centralizar en CajuEat el contenido que un usuario hoy solo puede ver siguiendo la cuenta de Instagram del local — para no tener que seguir "millones de cuentas" — y usar un indicador visual en el mapa cuando un lugar tiene algo nuevo.

---

# ⚠️ Restricción real: esto no se puede hacer para cualquier cuenta, y las Historias no se pueden traer

El pedido asume que se puede "hacer un embed del perfil de Instagram" de cualquier local, incluyendo historias en tiempo real. Eso no es técnicamente posible hoy contra la API real de Instagram/Meta, y no es una limitación de esfuerzo — es una restricción de la plataforma:

- **No existe una forma de leer el contenido de una cuenta de Instagram ajena sin su consentimiento explícito.** La Instagram Graph API solo entrega contenido de cuentas Business/Creator que se conectaron mediante OAuth real, otorgado por el dueño de esa cuenta — no hay "embeber cualquier perfil" sin que ese local lo autorice.
- **Las Historias no son accesibles vía API pública en absoluto**, ni para cuentas conectadas con permisos estándar — Meta las trata como contenido efímero de alta sensibilidad, con acceso muy restringido incluso para apps aprobadas. Además expiran a las 24hs por diseño de la plataforma, así que "historias en tiempo real" tal como lo describe el pedido no es viable con las APIs públicas actuales.
- La API de embeds simple de un solo post (oEmbed) también requiere un token de acceso de la app, no es un `<iframe>` libre.

Este spec redefine el alcance a lo que sí es real: **posts** de una cuenta que **se conectó voluntariamente** al programa, nunca contenido de un tercero sin su autorización, y nunca Historias.

---

# Comportamiento (alcance real)

## Opt-in del local

Un local que ya está en el catálogo (via Admin, verificado como en SPEC-020) puede conectar su cuenta de Instagram Business/Creator real mediante OAuth — mismo tipo de flujo que cualquier integración estándar (el local otorga permiso explícito, CajuEat nunca accede sin eso). Sin esta conexión, el restaurante simplemente no tiene esta sección — nunca se intenta traer contenido de una cuenta que no se conectó.

## Contenido mostrado

- Los posts recientes (imagen/video, caption) de la cuenta conectada, vía Instagram Graph API, mostrados en una sección nueva de la ficha del restaurante (SPEC-003).
- Refrescado periódico (poll, no push real — la Graph API soporta webhooks de cambios de media para cuentas conectadas, así que un refresco casi inmediato es técnicamente posible, pero no "en tiempo real" en el sentido de historias efímeras).
- **Sin Historias** — explícitamente fuera de alcance por la restricción de arriba.

## Indicador de novedad en el mapa

Cuando un restaurante conectado publica contenido nuevo (post nuevo detectado en el último refresco, o una promo activa de [SPEC-022](SPEC-022-real-time-promotions.md)), su pin en el Living Map (SPEC-001) muestra un borde de color distinto (ej. verde para promo activa, amarillo para post nuevo — colores exactos a definir con diseño) durante una ventana de tiempo corta (ej. 48hs) — después vuelve al pin normal, nunca queda "marcado" para siempre.

---

# Qué NO hace este spec

No embebe contenido de una cuenta que no se conectó explícitamente — nunca scraping ni acceso sin consentimiento. No trae Historias, por la restricción de plataforma explicada arriba. No construye un feed cronológico multi-restaurante dentro de CajuEat (tipo "tu feed de Instagram, pero de todos los locales que seguís acá") — cada perfil de restaurante muestra su propio contenido, no hay agregación entre locales todavía.

---

# Acceptance Criteria

✓ Un restaurante muestra contenido de Instagram solo si su cuenta fue conectada explícitamente vía OAuth — nunca antes.

✓ Ninguna vista de la app muestra ni promete mostrar Historias de Instagram.

✓ El indicador de novedad en el mapa desaparece automáticamente pasada su ventana de vigencia — nunca queda marcado indefinidamente.

✓ Si la conexión de un local se revoca (el dueño desconecta la cuenta), la sección de Instagram desaparece de su ficha sin dejar contenido cacheado visible.

---

# Open Questions

- Qué proveedor/flow técnico exacto usar para el OAuth de Instagram Business (Meta lo reorganiza con frecuencia entre "Instagram Graph API" e "Instagram API with Instagram Login") — verificar el estado vigente de la documentación oficial al momento de implementar, no asumir que lo descrito hoy sigue igual.
- Si vale la pena, además de posts, sumar el rating agregado de Google (ver [SPEC-026](SPEC-026-google-reviews-signal.md)) en la misma sección de "novedades", ya que ambos son señales externas al catálogo curado.
- Colores/semántica exacta del borde del pin — decisión de diseño, no de producto.

---

# Notas para Claude Code

No implementar nada de esto contra ninguna cuenta real sin que el usuario primero confirme que tiene (o va a gestionar) el acceso de desarrollador de Meta necesario — es una integración de terceros con proceso de aprobación de la plataforma, no algo que se pueda simular libremente. El indicador de novedad en el mapa puede reusar `MapPin`/`LivingMapCanvas` (SPEC-001) con una prop nueva de "estado" en vez de un componente paralelo.
