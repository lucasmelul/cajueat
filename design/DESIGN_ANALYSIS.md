# DESIGN_ANALYSIS.md

> Auditoría de diseño de Lugarcito (source repo/codename: cajueat). Antes de diseñar pantallas.
> Basado en la lectura completa de `/docs` (Context Pack, CP-001+, PRD-001+, SPEC-001+).

---

## 1. Resumen del producto

Lugarcito es un **Brain gastronómico AI-native** cuya primera interfaz es una **PWA mobile-first**. No es una app de listados: **no muestra listas, ayuda a decidir**. Se compone de tres productos separados a propósito — **Brain** (la inteligencia, el protagonista), **Platform** (auth, puntos, CMS, analytics) y **PWA** (el primer cliente).

Cinco principios rectores: **Brain First · Map First · Conversation First · Trust First · Knowledge Compounds.**

El estándar de calidad declarado: *"Nunca usé algo que funcione así."* Referencias de nivel (no de features): Apple, Arc, Linear, Raycast, Perplexity, Airbnb, Notion, Superhuman.

## 2. Principios de UX

1. **El mapa es la Home.** No hay otra pantalla inicial. Todo empieza y vuelve al mapa (SPEC-001).
2. **Menos interfaz, más producto** (SPEC-012). Respirar, poca densidad, jerarquía clara, mucho contexto, poco ruido.
3. **La conversación es una forma de navegar**, no un chat de soporte. No copiar ChatGPT/WhatsApp.
4. **Mostrar solo lo necesario para decidir.** La pregunta que el usuario responde es *"¿dónde debería comer?"*, no *"¿cuántos datos tiene este lugar?"*.
5. **Confianza visible.** El usuario percibe cuándo el Brain está seguro, cuándo duda y en qué se basa — sin dashboards técnicos.
6. **El conocimiento se capitaliza.** Cada interacción (feedback, quiz, foto) mejora al Brain; la gamificación sirve al conocimiento, no a la retención.

## 3. Principios visuales

- **Premium, futurista, calmo.** Reconocible sin logo (SPEC-012).
- **Color muy contenido:** neutrales cálidos + un único acento caju. La información tiene prioridad, no el color.
- **Tipografía de altísima legibilidad, pocas variantes.** Una voz serif editorial para el Brain; un grotesque neutro para la UI; mono para datos.
- **Motion funcional, nunca decorativo.** Sutil, rápido, espacialmente honesto (calidad Apple).
- **Superficies como papel elevado** flotando sobre un mapa vivo.

## 4. Componentes detectados (desde los docs)

De SPEC-001 / SPEC-003 / design-brief se desprende el vocabulario real del producto:

| Componente | Fuente |
|---|---|
| Living Map Canvas | SPEC-001 |
| Prompt Bar (siempre visible) | SPEC-001 |
| Brain Card (flotante, una sola) | SPEC-001 |
| Restaurant Pins (tipados, jerarquizados) | SPEC-001 |
| Restaurant Bottom Sheet (peek/half/full) | SPEC-001 |
| Floating Buttons (ubicación, recentrar, capas) | SPEC-001 |
| Context Chips | design-brief |
| Restaurant Card | design-brief / SPEC-003 |
| Brain Summary, Quick Facts, Qué pedir, Brain Tips, Ideal/No-ideal, Sources | SPEC-003 |
| Trust indicator (nivel de confianza) | trust-engine.md |
| Source / Curator entity | sources-and-curators / CP-012 |
| Caju Points, micro-quiz | gamification.md |
| Knowledge Capture (voz/foto/link) | PRD-004 |
| Feedback conversacional | CP-009 |

→ Traducidos a primitivas reutilizables en `COMPONENT_LIBRARY.md`.

## 5. Inconsistencias / ambigüedades encontradas

Ninguna contradicción de producto grave. Puntos **abiertos** que los docs delegan explícitamente a diseño:

- **Sistema visual, tipografía y color:** no definidos (SPEC-012). → Los propone este sistema.
- **Cómo se visualiza la confianza:** ¿score, lenguaje natural, iconografía? (design-brief, trust-engine). → Decisión de diseño abajo.
- **Cómo se diferencian los tipos de pin** sin saturar. → Decisión de diseño abajo.
- **Auth:** OTP por teléfono sugerido pero abierto. → Fuera del alcance visual del MVP; se documenta.
- **Logo/marca:** inexistente en el repo. → No se inventa (ver Decisiones).

## 6. Oportunidades de mejora (sin romper producto)

- **Trust Meter** que combina lenguaje natural + 3 barras: legible de un vistazo, sin parecer dashboard.
- **Un solo pin con etiqueta** (la recomendación principal del Brain) y el resto como puntos: refuerza "relevancia sobre cantidad".
- **La barra de conversación es también la entrada a Knowledge Capture** (el mic): menos superficie, más producto.
- **Feedback como conversación de 3-4 pasos con chips**, no formulario: cumple CP-009 y se siente vivo.
- **Voz serif del Brain** para narrativa/preguntas: da personalidad sin recargar.

## 7. Dudas para producto (documentar, no resolver diseñando)

1. ¿El Trust Meter muestra también un número, o solo lenguaje + barras? (propuesta: solo lenguaje + barras en la UI; el score crudo queda para debugging/admin).
2. ¿Hay tab bar en la PWA, o navegación 100% desde el mapa? (propuesta: tab bar mínima para Explorar/Aportar/Perfil, sin competir con el mapa).
3. ¿Caju Points tiene niveles/recompensas canjeables? (product-decisions lo deja abierto).
4. ¿La galería del restaurante admite fotos generadas por IA? (open question en SPEC-003).

## 8. Decisiones de diseño que tomo

- **Acento único caju** (coral del cashew) sobre neutrales cálidos; verde *leaf* para confianza, terracota *clay* para conflicto.
- **Confianza = lenguaje natural + meter de 3 barras** (`TrustMeter`), nunca estrellas.
- **Pines tipados con una paleta contenida**; solo el principal lleva etiqueta.
- **Tipografías:** Geist (UI), Newsreader (voz del Brain), Geist Mono (datos), Bricolage Grotesque (wordmark).
- **Sin logo inventado:** wordmark tipográfico + marca sparkle como presencia del Brain.
- **Iconografía Lucide** (línea fina), marcada como sustitución.
- **Tab bar mínima** en la PWA para no atar todo al mapa, respetando que el mapa es la Home.

Estas decisiones se detallan en `DESIGN_SYSTEM.md`, `INFORMATION_ARCHITECTURE.md`, `USER_FLOWS.md` y `COMPONENT_LIBRARY.md`.
