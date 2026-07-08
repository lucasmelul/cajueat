# SPEC-024 — Contenido de Instagram en el Perfil + Indicador de Novedad en el Mapa (nueva)

**Status:** Draft — dos caminos técnicos reales documentados, con recomendación (Camino 1); Historias fuera de alcance en ambos, ver abajo
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

# Investigación real (2026-07-08) — hay dos caminos técnicos, y ambos existen de verdad

La primera versión de este spec asumía que embeber cualquier perfil era simplemente imposible sin conexión del local. Investigando el estado actual (no de memoria vieja) aparece un matiz importante: **sí existe** el tipo de widget "JS que embebe el feed de cualquier perfil" al que se refería el pedido — herramientas como Elfsight, SnapWidget o LightWidget lo ofrecen hoy, funcionan poniendo solo el `@usuario`, y no requieren que el local autorice nada si la cuenta es pública. Es real, es tan simple como pegar un `<script>`, y confirma por qué el pedido original lo daba por hecho.

Dicho eso, hay dos caminos con tradeoffs distintos, no una sola respuesta técnica:

## Camino 1 — Oficial, con consentimiento del local (recomendado)

El local conecta su cuenta Instagram Business/Creator vía OAuth (Instagram Graph API / Instagram API with Instagram Login). Desde octubre 2025 este flujo es más simple que antes — **ya no exige verificación de Meta Business**, solo el login/autorización estándar. Devuelve posts reales, con datos confiables, sin depender de que Instagram no le corte el acceso a un scraper de terceros.

## Camino 2 — Widget de terceros, sin conexión del local

Un servicio como los de arriba muestra el feed de cualquier cuenta pública sin que su dueño autorice nada a CajuEat — de cero fricción para el local, pero **sin su consentimiento explícito**. Técnicamente funciona (probablemente no sea scraping crudo del lado de CajuEat, sino que el proveedor del widget lo resuelve por su cuenta), refresca cada ~48hs (no en tiempo real), y es frágil si Instagram le corta el acceso al proveedor del widget.

**Recomendación de este spec: Camino 1.** Es el que respeta el mismo principio de consentimiento que ya rige todo el resto de CajuEat (nunca usar contenido de un tercero sin que haya dado su autorización — mismo espíritu que "nunca se scrapea Instagram/TikTok" ya establecido para curadores). El Camino 2 queda documentado como opción real y disponible, no descartada, para que el negocio decida si el trade-off (cero fricción para el local, pero sin su permiso) vale la pena en algún caso puntual — no es una decisión que corresponda tomar en este documento.

## Las Historias, en cualquiera de los dos caminos, no se pueden traer

Confirmado para ambos: ninguna herramienta, oficial o de terceros, puede mostrar Historias de Instagram — Meta las trata como contenido efímero de alta sensibilidad, sin acceso vía API pública bajo ninguna circunstancia, y expiran a las 24hs por diseño. "Historias en tiempo real" tal como lo describe el pedido original no es viable con ninguna herramienta que exista hoy.

## Sobre "reservar, ver menú, horarios"

Esto no sale de ningún embed de Instagram — son datos que ya vive en otro lado del sistema: los horarios y la dirección ya vienen de la integración de Google Places (ya implementada, factual, separada de opiniones). Un menú/catálogo de platos es [SPEC-025](SPEC-025-dish-catalog.md), con su propia fuente curada. Reservas no tiene spec propio todavía — si el local usa "Reservar" nativo de Instagram, ese botón vive en su perfil de Instagram, no es algo que un embed de feed traiga consigo.

---

# Comportamiento (alcance real)

## Opt-in del local

Un local que ya está en el catálogo (via Admin, verificado como en SPEC-020) puede conectar su cuenta de Instagram Business/Creator real mediante OAuth (Camino 1) — mismo tipo de flujo que cualquier integración estándar (el local otorga permiso explícito, CajuEat nunca accede sin eso). Sin esta conexión, el restaurante simplemente no tiene esta sección — nunca se intenta traer contenido de una cuenta que no se conectó, salvo que el negocio decida explícitamente habilitar el Camino 2 para casos puntuales (fuera del comportamiento default).

## Contenido mostrado

- Los posts recientes (imagen/video, caption) de la cuenta conectada, vía Instagram Graph API, mostrados en una sección nueva de la ficha del restaurante (SPEC-003).
- Refrescado periódico (poll, no push real — la Graph API soporta webhooks de cambios de media para cuentas conectadas, así que un refresco casi inmediato es técnicamente posible, pero no "en tiempo real" en el sentido de historias efímeras).
- **Sin Historias** — imposible en cualquiera de los dos caminos, ver arriba.

## Indicador de novedad en el mapa

Cuando un restaurante conectado publica contenido nuevo (post nuevo detectado en el último refresco, o una promo activa de [SPEC-022](SPEC-022-real-time-promotions.md)), su pin en el Living Map (SPEC-001) muestra un borde de color distinto (ej. verde para promo activa, amarillo para post nuevo — colores exactos a definir con diseño) durante una ventana de tiempo corta (ej. 48hs) — después vuelve al pin normal, nunca queda "marcado" para siempre.

---

# Qué NO hace este spec

No usa el Camino 2 (widget sin consentimiento) por default — solo si el negocio lo decide explícitamente para un caso puntual, nunca como comportamiento general del producto. No trae Historias, por ninguno de los dos caminos. No construye un feed cronológico multi-restaurante dentro de CajuEat (tipo "tu feed de Instagram, pero de todos los locales que seguís acá") — cada perfil de restaurante muestra su propio contenido, no hay agregación entre locales todavía.

---

# Acceptance Criteria

✓ Por default, un restaurante muestra contenido de Instagram solo si su cuenta fue conectada explícitamente vía OAuth (Camino 1) — nunca antes.

✓ Si en algún caso puntual se habilita el Camino 2, queda registrado en Admin que ese restaurante no dio consentimiento explícito — nunca se presenta igual que uno conectado.

✓ Ninguna vista de la app muestra ni promete mostrar Historias de Instagram.

✓ El indicador de novedad en el mapa desaparece automáticamente pasada su ventana de vigencia — nunca queda marcado indefinidamente.

✓ Si la conexión de un local se revoca (el dueño desconecta la cuenta), la sección de Instagram desaparece de su ficha sin dejar contenido cacheado visible.

---

# Open Questions

- Qué proveedor/flow técnico exacto usar para el OAuth de Instagram Business (Meta lo reorganiza con frecuencia entre "Instagram Graph API" e "Instagram API with Instagram Login") — verificar el estado vigente de la documentación oficial al momento de implementar, no asumir que lo descrito hoy sigue igual.
- Si vale la pena habilitar el Camino 2 como fallback automático para locales que todavía no conectaron su cuenta (ej. mostrar su feed público sin conexión hasta que se sumen formalmente) — es una decisión de producto/marca real, no técnica, y este spec no la resuelve por su cuenta.
- Si vale la pena, además de posts, sumar el rating agregado de Google (ver [SPEC-026](SPEC-026-google-reviews-signal.md)) en la misma sección de "novedades", ya que ambos son señales externas al catálogo curado.
- Colores/semántica exacta del borde del pin — decisión de diseño, no de producto.

---

# Notas para Claude Code

No implementar el Camino 1 contra ninguna cuenta real sin que el usuario primero confirme que tiene (o va a gestionar) el acceso de desarrollador de Meta necesario — es una integración de terceros con proceso de aprobación de la plataforma, no algo que se pueda simular libremente. Si se pide el Camino 2, usar un proveedor de terceros establecido (no construir scraping propio) y dejar explícito en el modelo de datos qué restaurantes están en modo "sin consentimiento" vs. "conectado". El indicador de novedad en el mapa puede reusar `MapPin`/`LivingMapCanvas` (SPEC-001) con una prop nueva de "estado" en vez de un componente paralelo.
