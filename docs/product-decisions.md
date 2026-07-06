# Registro de Decisiones de Producto

Este documento consolida las decisiones **ya tomadas** y las **abiertas** que surgieron durante la definición inicial de CajuEat. Se actualiza a medida que se resuelven decisiones abiertas o surgen nuevas.

## Decisiones ya tomadas

| Decisión | Resolución |
|---|---|
| Tipo de producto | Plataforma AI-native de decisión gastronómica, no un directorio ni una red social. Ver [vision.md](vision.md). |
| Separación del sistema | Tres productos: Brain, Platform, PWA. Ver [product.md](product.md). |
| Primer cliente | PWA, no app nativa. |
| Punto de entrada | Mapa (Living Map), no una lista ni un buscador tradicional. |
| Interfaz principal | Conversación, no formularios. |
| Postura ante la incertidumbre | El Brain nunca inventa; si no sabe, lo dice (Trust First). |
| Alcance geográfico del MVP | Una sola ciudad. Ver [mvp.md](mvp.md). |
| Rol de la gamificación | Recompensar aporte de conocimiento, no consumo pasivo. Ver [gamification.md](gamification.md). |
| Rol de ingeniería | Define arquitectura y stack; producto no se los impone salvo razón de negocio fuerte. Ver [codex-brief.md](codex-brief.md). |
| Momento del login | Diferido. El usuario usa la app sin cuenta desde la primera apertura; el Brain aprende igual, atado a una identidad anónima server-side. Recién se pide teléfono cuando el usuario ya construyó valor, enmarcado como "guardar tu Brain", no como registrarse. Arquitectura: identidad anónima server-side, nunca Brain corriendo local — ver [SPEC-013 — Deferred Identity](specs/SPEC-013-deferred-identity.md). |

## Decisiones abiertas

### 1. Método de autenticación

**Contexto:** se sugirió simplificar al máximo, posiblemente usando solo teléfono con OTP, evitando usuario/contraseña. El *momento* en que se dispara ya se decidió (diferido, ver tabla arriba) — lo que sigue abierto es el mecanismo en sí.

**Restricción de producto:** verificación en menos de 30 segundos, que no se sienta como "registrarse".

**Pendiente:** mecanismo definitivo (OTP por SMS, WhatsApp, email, u otro), y si hay algún método alternativo de respaldo.

**Dueño de la decisión final:** ingeniería, dentro de la restricción de UX. Ver [PRD-010 — Onboarding](prds/PRD-010-onboarding.md) y [SPEC-013 — Deferred Identity](specs/SPEC-013-deferred-identity.md).

### 2. Fuentes y curadores iniciales

**Contexto:** la idea de nutrir al Brain con listas de foodies/curadores (ej. @buenospaladaires_, @salt_argentina) es conceptual; no hay una lista cerrada ni acuerdos confirmados.

**Pendiente:** qué fuentes se incorporan primero, si existe curación editorial humana antes del lanzamiento, y si hay algún tipo de relación formal con esas fuentes. Ver [sources-and-curators.md](sources-and-curators.md).

### 3. Ponderación exacta del Trust Engine

**Contexto:** el modelo conceptual de señales fuertes/medias/débiles está definido (ver [trust-engine.md](trust-engine.md)), pero no los pesos, fórmulas ni umbrales exactos.

**Dueño de la decisión final:** ingeniería/data, en conjunto con producto para validar que el resultado se sienta confiable.

### 4. Tabla de Caju Points

**Contexto:** están definidas las acciones que otorgan puntos (ver [gamification.md](gamification.md)), pero no los valores exactos, niveles, ni si hay recompensas canjeables.

**Pendiente:** definir en una iteración posterior de [PRD-006 — Caju Points](prds/PRD-006-caju-points.md).

### 5. Visualización de confianza

**Contexto:** el Brain necesita expresar cuánto confía en una recomendación, pero el lenguaje visual (score numérico, texto, iconografía) no está definido.

**Dueño de la decisión final:** diseño, a partir de [design-brief.md](design-brief.md) y [trust-engine.md](trust-engine.md).

### 6. Numeración y alcance de PRDs más allá del set inicial

**Contexto:** el repositorio contenía, antes de esta consolidación, PRDs adicionales (Living Map, Search, Collections, Compare, Planning, Notifications, Onboarding) numerados del 006 al 015, que no coinciden con la lista canónica de 10 PRDs iniciales definida en el context pack. Como parte de esta consolidación, los PRD-001 a PRD-010 se realinearon a la lista canónica (Home/Living Map, Conversational Brain, Restaurant Experience, Knowledge Capture, Post Visit Feedback, Caju Points, Sources & Curators, Trust Engine, Onboarding, User Profile), reasignando o reescribiendo el contenido de los números que tenían otro tema.

**Efecto colateral:** los PRD-011 a PRD-015 (Collections, Compare, Planning, Notifications, Onboarding) quedaron fuera de este alcance y no se tocaron. Esto genera una duplicación temática entre el nuevo PRD-009 (Onboarding) y el existente PRD-015 (Onboarding), y deja temas como Search, Living Map standalone, Collections, Compare y Planning sin un lugar claro en la numeración canónica.

**Pendiente:** decidir si estos PRDs adicionales se archivan, se fusionan con los PRDs canónicos correspondientes, o se renumeran como PRD-016 en adelante en una futura pasada de consolidación. No se tomó esta decisión en este trabajo porque el alcance solicitado fue explícitamente PRD-001 a PRD-010.

### 7. Timing del roadmap

**Contexto:** las fases del roadmap (ver [roadmap.md](roadmap.md)) están definidas por criterio de graduación, no por fechas.

**Pendiente:** fechas objetivo, duración de la beta privada y criterios numéricos concretos de éxito por fase.
