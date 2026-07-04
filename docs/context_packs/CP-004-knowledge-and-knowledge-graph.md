# CP-004 — Knowledge & Knowledge Graph

**Estado:** Draft
**Versión:** 1.0
**Owner:** Product
**Consumidores:** Claude Code, Claude Design, Product

---

# Objetivo

Definir qué entiende CajuEat por conocimiento y cómo debe modelarlo.

El Brain no almacena restaurantes.

El Brain construye un modelo del mundo gastronómico.

---

# Resumen Ejecutivo

La mayoría de las aplicaciones trabajan con registros.

Restaurant.

Review.

Photo.

User.

Nosotros trabajamos con conocimiento.

Cada dato existe porque ayuda al Brain a tomar mejores decisiones.

Todo el conocimiento está conectado.

---

# Filosofía

No queremos construir una base de datos.

Queremos construir un Knowledge Graph gastronómico.

Cada entidad se relaciona con otras.

El valor no está en las entidades.

Está en las relaciones.

---

# Objetivo Final

Responder preguntas como:

> ¿Dónde debería comer hoy?

No buscando restaurantes.

Sino razonando sobre conocimiento.

---

# Principios

## Todo es una entidad

No solamente los restaurantes.

También:

- platos;
- chefs;
- ingredientes;
- vinos;
- cafeterías;
- barrios;
- eventos;
- usuarios;
- influencers;
- listas;
- experiencias;
- visitas.

---

## Todo tiene relaciones

Ejemplo.

Restaurant

↓

Sirve

↓

Dish

↓

Usa

↓

Ingredient

↓

Relacionado con

↓

Cuisine

---

## Todo cambia

Los restaurantes evolucionan.

Los chefs cambian.

Los menús cambian.

Las recomendaciones cambian.

Nada es permanente.

---

# Entidades principales

## Restaurant

Representa un lugar gastronómico.

No importa cuántas veces cambie de menú.

Sigue siendo la misma entidad.

---

## Dish

Representa una preparación.

Ejemplo.

Carbonara.

Ramen.

Flat White.

Negroni.

---

## Chef

Una persona.

Puede trabajar en distintos restaurantes.

---

## Menu

Representa una carta en un momento determinado.

No es permanente.

---

## Ingredient

Elemento utilizado por distintos platos.

---

## Beverage

Vinos.

Cervezas.

Cócteles.

Café.

Té.

---

## Neighborhood

Una zona gastronómica.

No solamente un barrio administrativo.

---

## Experience

La unidad más importante del Brain.

Una experiencia representa:

Persona.

↓

Lugar.

↓

Momento.

↓

Contexto.

↓

Resultado.

---

## Visit

Representa la presencia física.

Una experiencia puede incluir varias visitas.

---

## User

No es solamente una cuenta.

Es un conjunto de preferencias.

---

## Source

Representa una fuente de conocimiento.

Puede ser:

- Google;
- Michelin;
- Buenos Paladaires;
- Salt Argentina;
- Comunidad Caju.

---

## Curated List

Una colección creada por un experto.

Ejemplo.

Las mejores hamburguesas.

---

## Memory

Representa conocimiento persistente sobre un usuario.

---

# Relaciones

Las relaciones son más importantes que las entidades.

Ejemplos.

Restaurant

SERVES

Dish

---

Restaurant

LOCATED_IN

Neighborhood

---

Chef

WORKS_AT

Restaurant

---

User

VISITED

Restaurant

---

User

LIKES

Dish

---

Source

RECOMMENDS

Restaurant

---

Restaurant

SIMILAR_TO

Restaurant

---

Dish

PAIRS_WITH

Wine

---

Experience

HAPPENED_AT

Restaurant

---

# Experience Graph

La experiencia es la unidad de aprendizaje.

No aprendemos:

Restaurant → Bueno.

Aprendemos:

Usuario.

↓

Fue.

↓

Con pareja.

↓

Un viernes.

↓

Llovía.

↓

Esperó poco.

↓

Le encantó.

Eso es conocimiento útil.

---

# Memoria

La memoria guarda únicamente aprendizajes.

Ejemplo.

No:

Lucas fue a XXXXX.

Sí:

Lucas disfruta barras japonesas pequeñas.

---

# Evolución

Cada entidad cambia con el tiempo.

Por ejemplo.

Restaurant.

- menú;
- chef;
- decoración;
- horario;
- reputación.

El Brain nunca considera un dato eterno.

---

# Knowledge vs Data

Dato.

"Abre a las 20."

Conocimiento.

"Suele abrir puntual, pero la cocina comienza a trabajar realmente 20:20."

---

# Contexto

Todo conocimiento depende del contexto.

Ejemplos.

Una terraza.

Excelente.

↓

Verano.

---

La misma terraza.

↓

Invierno.

↓

Pierde valor.

---

# Conocimiento Derivado

El Brain también genera conocimiento.

Ejemplo.

Detecta que:

Usuarios que aman sushi tradicional también suelen disfrutar izakayas.

Eso no lo dijo nadie.

Lo aprendió.

---

# Conocimiento Explícito

Información declarada.

Ejemplo.

Horario.

Dirección.

Menú.

---

# Conocimiento Implícito

Inferencias.

Ejemplo.

Ideal para primera cita.

Buena acústica.

Muy tranquilo.

Vale la pena reservar.

---

# Calidad del Conocimiento

Cada conocimiento tiene:

- origen;
- evidencia;
- confianza;
- fecha;
- contexto.

Nunca existe una afirmación sin respaldo.

---

# Fuentes

El conocimiento puede provenir de:

- usuarios;
- comunidad;
- influencers;
- guías;
- chefs;
- datos públicos;
- observación del Brain.

---

# Aprendizaje

Cada nueva evidencia puede:

- confirmar;
- debilitar;
- reemplazar;
- enriquecer conocimiento existente.

Nunca simplemente duplicarlo.

---

# Objetivo Estratégico

Construir el mayor activo intelectual de CajuEat.

No la mayor base de restaurantes.

Sino el mayor grafo de conocimiento gastronómico.

---

# Reglas

- Todo conocimiento debe mejorar una decisión.
- Toda entidad debe poder relacionarse.
- Todo dato tiene contexto.
- Todo conocimiento puede evolucionar.
- Toda afirmación debe tener evidencia.

---

# Decisiones Tomadas

✅ El Brain utiliza un Knowledge Graph conceptual.

✅ La experiencia es la principal unidad de aprendizaje.

✅ Las relaciones son más importantes que las entidades.

✅ El conocimiento evoluciona constantemente.

---

# Decisiones Abiertas

- Modelo definitivo del grafo.
- Persistencia temporal.
- Estrategia de inferencias.
- Ontología completa.

---

# Qué NO hacer

No pensar en tablas.

No pensar en SQL.

No pensar en Neo4j.

No pensar en tecnología.

Este documento describe conocimiento.

No implementación.

---

# Documentos Derivados

- knowledge.md
- ontology.md
- memory.md
- sources.md
- trust-engine.md
- PRD-004
- PRD-007

---

# Estado

Este documento define el modelo conceptual del conocimiento de CajuEat.

Toda implementación deberá respetar estos principios independientemente de la tecnología elegida.
