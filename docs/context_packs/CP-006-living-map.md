# CP-006 — Living Map

**Estado:** Draft
**Versión:** 1.0
**Owner:** Product
**Consumidores:** Claude Design, Claude Code, Product

---

# Objetivo

Definir el Living Map, la funcionalidad más importante de la aplicación.

El mapa no es una pantalla.

Es el centro de la experiencia.

Toda la navegación del producto nace desde el mapa.

---

# Resumen Ejecutivo

En la mayoría de las aplicaciones el mapa es un buscador geográfico.

En CajuEat el mapa representa conocimiento.

No muestra restaurantes.

Muestra oportunidades.

---

# Nuestra Tesis

Google Maps responde:

"Estos lugares existen."

El Living Map responde:

"Estos lugares son relevantes para vos, ahora."

La diferencia es enorme.

---

# Filosofía

El mapa nunca debería sentirse vacío.

Pero tampoco saturado.

Cada elemento visible debe existir por una razón.

---

# Home del Producto

La Home de CajuEat ES el mapa.

No existe una pantalla de inicio previa.

Al abrir la aplicación el usuario entra directamente al Living Map.

---

# Objetivos

El Living Map debe permitir:

- descubrir lugares;
- explorar zonas;
- conversar con el Brain;
- guardar lugares;
- iniciar planes;
- entender contexto;
- volver a experiencias anteriores.

Todo desde una misma pantalla.

---

# Principios

## Menos Pins

No queremos cientos de marcadores.

Queremos pocos.

Pero inteligentes.

---

## Contexto

Los lugares visibles dependen del contexto.

Ejemplos.

Hora.

Clima.

Ubicación.

Compañía.

Preferencias.

---

## Dinamismo

El mapa cambia.

No es estático.

A medida que cambia el contexto cambian las recomendaciones.

---

## Descubrimiento

El objetivo principal del mapa es descubrir.

No buscar.

---

# Qué muestra

Puede mostrar:

- recomendaciones;
- lugares guardados;
- lugares visitados;
- novedades;
- colecciones;
- zonas gastronómicas;
- eventos;
- experiencias.

Nunca un catálogo completo.

---

# Qué NO muestra

No mostrar:

- miles de restaurantes;
- resultados irrelevantes;
- publicidad;
- pins repetidos;
- lugares sin valor.

---

# Componentes

## Brain Card

Elemento principal.

Siempre visible.

Resume:

- recomendación principal;
- contexto;
- sugerencias.

---

## Prompt Bar

Entrada conversacional.

El usuario puede escribir o hablar.

Ejemplos.

"Quiero comer ramen."

"Algo barato."

"Sorprendeme."

---

## Context Chips

Representan filtros naturales.

Ejemplos.

🍣 Sushi

❤️ Pareja

🌧 Lluvia

☕ Café

No son filtros técnicos.

Son contexto.

---

## Restaurant Cards

Cards contextuales.

No son listados.

Representan oportunidades.

---

## Bottom Sheet

Cuando el usuario toca un lugar.

Se abre una vista resumida.

La ficha completa aparece solo cuando el usuario profundiza.

---

# Exploración

El usuario puede explorar libremente.

Pero el Brain continúa guiando.

Ejemplo.

Si mueve el mapa.

El Brain adapta las recomendaciones.

---

# Descubrimiento Pasivo

Sin escribir nada.

El usuario debería encontrar lugares interesantes.

Objetivo.

Menos de diez segundos.

---

# Descubrimiento Activo

El usuario conversa.

El Brain modifica el mapa.

El mapa responde.

---

# Zoom

El nivel de zoom modifica la información.

Ejemplo.

Muy lejos.

Mostrar zonas.

---

Intermedio.

Mostrar recomendaciones.

---

Muy cerca.

Mostrar lugares específicos.

---

# Selección

Al tocar un restaurante.

El mapa nunca desaparece completamente.

Debe mantenerse el contexto espacial.

---

# Navegación

El mapa es el eje.

Desde él se llega a:

- restaurante;
- colecciones;
- planes;
- perfil;
- conversación.

---

# Relación con el Brain

El mapa nunca toma decisiones.

El Brain decide.

El mapa representa esas decisiones.

---

# Personalización

Dos usuarios en el mismo lugar pueden ver mapas diferentes.

Porque el Brain conoce sus preferencias.

---

# Tiempo Real

Idealmente el mapa evoluciona.

Ejemplos.

- cambió el clima;
- cerró un restaurante;
- apareció una feria;
- abrió una cafetería.

---

# Casos de Uso

## Caso 1

Abro la app.

Sin escribir nada.

Encuentro una excelente recomendación.

---

## Caso 2

Muevo el mapa.

El Brain cambia las sugerencias.

---

## Caso 3

Pregunto:

"Algo tranquilo para trabajar."

El mapa responde visualmente.

---

## Caso 4

Guardo un lugar.

El mapa refleja esa acción.

---

# Objetivos UX

- descubrimiento inmediato;
- mínima fricción;
- sensación de inteligencia;
- contexto permanente.

---

# Reglas

- El mapa nunca es un listado.
- Los pins representan decisiones.
- Menos cantidad.
- Más relevancia.
- Todo elemento visible debe aportar valor.

---

# Decisiones Tomadas

✅ El mapa será la Home.

✅ El mapa representa conocimiento.

✅ El Brain controla las recomendaciones.

✅ El Prompt Bar vive sobre el mapa.

✅ El mapa es conversacional.

---

# Decisiones Abiertas

- Estilo visual.
- Animaciones.
- Clustering.
- Heatmaps.
- Navegación 3D.
- Capas futuras.

---

# Qué NO hacer

No copiar Google Maps.

No mostrar todos los restaurantes.

No usar el mapa como un simple buscador.

No convertirlo en una pantalla estática.

---

# Documentos Derivados

- living-map.md
- PRD-001
- design-brief.md
- MVP.md

---

# Estado

El Living Map representa la principal ventaja de experiencia de CajuEat.

Todo el producto gira alrededor de él.
