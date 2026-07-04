# PRD-001 — Living Map

Status: Draft
Owner: Product
Priority: P0
Depends on:
- CP-001 Product Vision
- CP-005 UX Principles
- CP-006 Living Map
- CP-018 Discovery Engine

---

# Objetivo

Construir la Home de CajuEat.

La Home debe permitir que un usuario descubra un excelente lugar para comer en menos de 30 segundos.

Debe convertirse en la principal puerta de entrada al Brain.

---

# Problema

Hoy descubrir dónde comer implica abrir varias aplicaciones.

Google Maps.

Instagram.

TikTok.

WhatsApp.

Buscar.

Comparar.

Leer reviews.

Ver fotos.

Decidir.

CajuEat debe condensar todo eso en una sola experiencia.

---

# Hipótesis

Si el Brain entiende el contexto del usuario.

Y presenta únicamente pocas recomendaciones excelentes.

Entonces la decisión será mucho más rápida y satisfactoria.

---

# Objetivos

Primario

Reducir el tiempo necesario para elegir.

---

Secundarios

Generar confianza.

Mostrar inteligencia.

Iniciar conversaciones.

Aprender del usuario.

---

# Usuarios

Nuevo usuario.

Usuario recurrente.

Usuario experto.

Turista.

Usuario explorando.

---

# Entry Points

Abrir la aplicación.

Volver desde otra pantalla.

Compartir ubicación.

Abrir desde una notificación.

---

# Componentes

Living Map

Prompt Bar

Brain Card

Restaurant Cards

Bottom Sheet

Context Chips

Floating Buttons

---

# Layout

Mapa ocupa prácticamente toda la pantalla.

Prompt fijo arriba.

Brain Card flotante.

Cards aparecen contextualmente.

Bottom Sheet deslizable.

Todo prioriza el mapa.

---

# Estados

Cold Start

↓

Loading

↓

Recommendations Ready

↓

Conversation

↓

Exploring

↓

Restaurant Selected

↓

Navigation

---

# Cold Start

El usuario nunca debería ver un mapa vacío.

Mientras carga.

El Brain prepara recomendaciones.

---

# Recommendation Ready

Al abrir.

Debe existir una recomendación principal.

No una lista.

---

# Brain Card

Siempre visible.

Debe responder.

¿Por qué abrir la aplicación hoy?

---

Puede contener

Una recomendación.

Una oportunidad.

Un descubrimiento.

Un recordatorio.

Una colección.

Un evento.

---

# Prompt Bar

Siempre visible.

Siempre accesible.

Placeholder dinámico.

Ejemplos.

¿Qué querés comer?

Sorprendeme.

Busco brunch.

Quiero una primera cita.

---

# Restaurant Cards

Cantidad máxima visible:

5

Nunca infinitas.

---

Cada card muestra

Hero

Nombre

Resumen

Motivo de recomendación

CTA

---

# Context Chips

No son filtros.

Son aceleradores conversacionales.

Ejemplos

🍣 Sushi

☕

🥂

❤️

🌧

💻

---

# Bottom Sheet

Tap restaurant

↓

Bottom Sheet

↓

Información resumida

↓

CTA

↓

Restaurant Page

---

# Animaciones

Todo debe sentirse extremadamente fluido.

Nunca exagerado.

Mover mapa.

↓

Cards reaccionan.

↓

Brain actualiza.

---

# Comportamientos

Mover mapa

↓

Brain recalcula.

---

Cambiar contexto

↓

Brain actualiza recomendaciones.

---

Hablar

↓

Mapa responde.

---

Guardar restaurante

↓

Feedback inmediato.

---

# Casos de Uso

Caso 1

Abro.

↓

Veo Brain Card.

↓

Abro restaurante.

↓

Decido.

---

Caso 2

Escribo.

"Algo romántico."

↓

Mapa cambia.

↓

Cards cambian.

↓

Elijo.

---

Caso 3

Muevo mapa.

↓

El Brain interpreta.

↓

Nuevas recomendaciones.

---

# Reglas

Nunca mostrar cientos de pins.

Nunca mostrar listas infinitas.

Nunca obligar a buscar.

Siempre priorizar descubrimiento.

---

# Empty States

Sin recomendaciones.

↓

Brain explica.

↓

Hace preguntas.

↓

Genera nuevas.

---

Sin ubicación.

↓

Permitir explorar igualmente.

---

# Edge Cases

GPS desactivado.

Internet lenta.

No hay datos suficientes.

Zona sin restaurantes.

Usuario nuevo.

---

# Métricas

Tiempo hasta primera interacción.

Tiempo hasta abrir restaurante.

Tiempo hasta decisión.

Conversaciones iniciadas.

Restaurantes guardados.

Feedback posterior.

---

# Acceptance Criteria

✓ El usuario descubre un lugar en menos de 30 segundos.

✓ El mapa nunca aparece vacío.

✓ Siempre existe una recomendación principal.

✓ El Brain explica por qué recomienda.

✓ La conversación modifica inmediatamente el mapa.

✓ El mapa nunca parece Google Maps.

---

# Notas para Claude Design

Diseñar una Home extremadamente limpia.

Inspiraciones:

- Apple Maps
- Arc
- Linear
- Perplexity

No copiar.

Crear una experiencia nueva.

---

# Notas para Claude Code

No asumir arquitectura.

Priorizar desacoplamiento entre:

UI

↓

Living Map

↓

Recommendation Engine

↓

Brain

Toda lógica debe vivir fuera de la interfaz.
