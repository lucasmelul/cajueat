# SPEC-001 — Living Map

**Status:** Draft
**Priority:** P0
**Owner:** Product
**Consumers:** Claude Design, Claude Code

---

# Objetivo

Definir el comportamiento funcional completo del Living Map.

Este documento NO define el diseño visual.

Define exactamente cómo debe comportarse la Home.

---

# Definición

El Living Map es la Home de CajuEat.

No existe otra pantalla inicial.

Toda la aplicación gira alrededor del mapa.

---

# Principios

El mapa nunca es un mapa vacío.

Siempre representa conocimiento.

Nunca muestra simplemente restaurantes.

Siempre muestra decisiones.

---

# Jerarquía

1. Mapa
2. Brain
3. Conversación
4. Restaurantes
5. Acciones

---

# Componentes

## Living Map Canvas

Ocupa toda la pantalla.

Siempre visible.

---

## Prompt Bar

Superior.

Siempre visible.

---

## Brain Card

Flotante.

Contextual.

---

## Restaurant Pins

Interactivos.

---

## Restaurant Bottom Sheet

Oculta.

Aparece bajo demanda.

---

## Floating Buttons

Ubicación.

Recentrar.

Capas futuras.

---

# Inicio

Usuario abre la aplicación.

↓

Splash < 500 ms

↓

Última posición conocida

↓

Brain genera recomendaciones

↓

Mapa aparece

↓

Brain Card aparece

↓

Pins aparecen progresivamente

---

# Si no existe ubicación

Mostrar Buenos Aires (MVP).

Con CTA.

"Usar mi ubicación"

El usuario igualmente puede explorar.

---

# Movimiento del mapa

Mientras el usuario mueve el mapa.

No recalcular inmediatamente.

Esperar.

Cuando deja de moverlo.

↓

Brain recalcula.

↓

Actualizar recomendaciones.

---

# Zoom

Zoom modifica contexto.

No solamente escala.

Ejemplo.

Zoom lejano.

↓

Pensar barrios.

---

Zoom cercano.

↓

Pensar restaurantes.

---

# Tap Restaurant

Tap.

↓

Pin crece.

↓

Bottom Sheet aparece.

↓

Mapa permanece visible.

---

# Doble Tap

Reservado.

No implementar en MVP.

---

# Long Press

Reservado.

---

# Selección

Solo un restaurante seleccionado.

Nunca múltiples.

---

# Bottom Sheet

Tres estados.

Peek.

↓

Half.

↓

Full.

---

Peek

Resumen.

---

Half

Información principal.

---

Full

CTA

↓

Restaurant Experience.

---

# Cierre

Swipe Down.

Tap mapa.

Back.

---

# Prompt

Nunca desaparece.

Puede contraerse.

Nunca ocultarse completamente.

---

# Brain Card

Puede representar.

Recomendación.

Oportunidad.

Descubrimiento.

Pregunta.

Recordatorio.

---

Siempre una sola.

---

# Restaurant Pins

No todos iguales.

El Brain decide importancia.

---

Ejemplo.

Principal.

Secundarios.

Descubrimientos.

---

Nunca cientos de pins.

---

# Recomendaciones

Máximo visible.

5

---

# Actualización

No actualizar continuamente.

Solo cuando cambia contexto.

---

# Contextos

Mover mapa.

Horario.

Clima.

Conversación.

Nueva memoria.

Nueva búsqueda.

---

# Navegación

Cómo llegar.

↓

Abrir Google Maps / Apple Maps.

No implementar navegación propia.

---

# Performance

Objetivo.

60 FPS.

---

Tiempo hasta interacción.

< 2 segundos.

---

# Offline

Mostrar.

Último mapa.

Últimos restaurantes.

Colecciones.

---

# Skeleton

Mientras carga.

Mostrar.

Mapa.

Brain Card.

Restaurant placeholders.

Nunca pantalla blanca.

---

# Errores

Sin internet.

↓

Modo offline.

---

Sin ubicación.

↓

Exploración libre.

---

Sin datos.

↓

Brain explica.

---

# Analytics

Map Opened

Map Moved

Restaurant Viewed

Restaurant Selected

Prompt Used

Conversation Started

Recommendation Accepted

Recommendation Rejected

Navigation Started

Restaurant Saved

---

# Accesibilidad

Todos los botones.

44px mínimo.

---

Gestos alternativos.

Siempre disponibles.

---

# Acceptance Criteria

✓ Home abre en menos de 2 segundos.

✓ Siempre existe una recomendación.

✓ El mapa nunca está vacío.

✓ El Brain responde al contexto.

✓ El usuario puede decidir sin abandonar el mapa.

---

# Open Questions

Heatmap.

Clusters.

Pins inteligentes.

Vista 3D.

AR futura.
