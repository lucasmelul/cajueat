# PRD-004 — Knowledge Acquisition

**Status:** Draft
**Priority:** P0
**Owner:** Product

Depends On

- CP-009 Knowledge Acquisition
- CP-008 Trust Engine
- CP-043 Brain Memory
- CP-074 Knowledge Importers

---

# Objetivo

Construir el sistema mediante el cual el Brain aprende.

Este es uno de los productos más importantes de CajuEat.

Mientras Google necesita millones de usuarios para mejorar lentamente.

Nosotros queremos que una sola persona pueda enseñarle muchísimo al Brain en pocos minutos.

---

# Problema

Hoy el conocimiento gastronómico está completamente fragmentado.

- Instagram
- TikTok
- Google Maps
- Blogs
- YouTube
- WhatsApp
- PDFs
- Guías
- Experiencias personales

Todo está separado.

El Brain debe unificarlo.

---

# Hipótesis

Si alimentar el Brain es extremadamente fácil.

Entonces el conocimiento crecerá constantemente.

Y la calidad de las recomendaciones aumentará cada semana.

---

# Filosofía

No queremos un CMS.

Queremos conversar con el Brain.

El usuario nunca debería pensar:

"Voy a cargar información."

Debería pensar:

"Le voy a mostrar esto."

---

# Objetivos

## Primarios

Agregar conocimiento.

Actualizar conocimiento.

Corregir conocimiento.

Validar conocimiento.

---

## Secundarios

Reducir fricción.

Evitar formularios.

Aprender automáticamente.

---

# Canales de Entrada

## Texto

Ejemplo

"Este restaurante cambió completamente."

---

## Voz

"Hoy fui a XXXXX y..."

---

## Instagram

Post.

Reel.

Perfil.

Lista.

---

## TikTok

Videos.

---

## YouTube

Videos.

Canales.

Playlists.

---

## Google Maps

Lugar.

Menú.

Fotos.

---

## Imagen

Carta.

Ticket.

Plato.

Fachada.

---

## PDF

Guías.

Rankings.

Notas.

---

## URL

Cualquier contenido gastronómico.

---

# Flujo Ideal

Usuario

↓

Comparte contenido

↓

Brain analiza

↓

Extrae conocimiento

↓

Detecta incertidumbre

↓

Pregunta solamente lo necesario

↓

Actualiza Knowledge Graph

↓

Aprende

Todo el proceso debería sentirse automático.

---

# Caso 1

Comparto un Reel.

↓

Brain detecta:

Restaurant.

↓

Chef.

↓

Platos.

↓

Opinión.

↓

Barrio.

↓

Ranking.

↓

Aprende.

---

# Caso 2

Le mando una foto del menú.

↓

OCR.

↓

Comparación con menú anterior.

↓

Detecta cambios.

↓

Actualiza conocimiento.

---

# Caso 3

Le hablo.

"Fui ayer a XXXXX."

↓

Brain identifica.

Restaurant.

↓

Experiencia.

↓

Platos.

↓

Contexto.

↓

Memoria.

---

# Caso 4

Le comparto un PDF.

↓

Brain resume.

↓

Extrae restaurantes.

↓

Extrae rankings.

↓

Aprende.

---

# Confirmación Inteligente

Nunca preguntar todo.

Ejemplo.

"Creo que encontré:

Restaurant A

Restaurant B

¿Son estos?"

Sí.

↓

Aprender.

---

# Preguntas

Siempre una por vez.

Nunca formularios.

---

# Extracción

Idealmente el Brain identifica automáticamente.

- restaurantes
- chefs
- platos
- bebidas
- ingredientes
- barrios
- listas
- experiencias
- recomendaciones
- opiniones

---

# Enriquecimiento

Si una entidad ya existe.

Nunca crear otra.

Actualizar.

---

# Confianza

Toda información nueva llega con confianza baja.

Va aumentando mediante evidencia.

---

# Feedback

Luego del aprendizaje.

El Brain puede decir.

"Aprendí 4 cosas nuevas."

No mostrar detalles técnicos.

---

# CMS Conversacional

Los administradores utilizan exactamente el mismo mecanismo.

Ejemplo.

"Importá esta guía Michelin."

↓

Brain aprende.

---

# UX

Todo debe sentirse como compartir contenido con un amigo.

No como cargar información.

---

# Edge Cases

Contenido duplicado.

↓

Fusionar.

---

Información contradictoria.

↓

Buscar evidencia.

---

No identifica restaurante.

↓

Preguntar.

---

No identifica idioma.

↓

Detectar automáticamente.

---

# Métricas

Tiempo promedio de importación.

Cantidad de entidades extraídas.

Cantidad de preguntas realizadas.

Precisión.

Conocimiento nuevo generado.

Tiempo hasta aprendizaje.

---

# Acceptance Criteria

✓ Compartir un Reel demora menos de 10 segundos.

✓ El Brain identifica automáticamente entidades.

✓ Nunca aparecen formularios.

✓ Solo pregunta cuando realmente es necesario.

✓ Todo termina integrado al Knowledge Graph.

---

# Futuro

Importaciones masivas.

Sincronización de influencers.

Feeds automáticos.

RSS.

Newsletters.

Emails.

Podcasts.

---

# Notas para Claude Design

La experiencia debe sentirse igual que compartir un Reel por WhatsApp.

Arrastrar.

Pegar.

Hablar.

Nada más.

Nunca mostrar procesos técnicos.

---

# Notas para Claude Code

Separar completamente:

Importador

↓

Extractor

↓

Normalizer

↓

Knowledge Validator

↓

Knowledge Graph

↓

Memory

↓

Trust Engine

Cada etapa debe poder evolucionar independientemente.

No asumir una tecnología específica.

El pipeline debe ser extensible para soportar nuevos tipos de contenido sin modificar los existentes.
