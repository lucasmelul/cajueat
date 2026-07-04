# CP-002 — Product Architecture

**Estado:** Draft
**Versión:** 1.0
**Owner:** Product
**Consumidores:** Claude Code, Claude Design, Product

---

# Objetivo

Definir cómo está dividido conceptualmente CajuEat.

Este documento NO habla de ingeniería.

No define tecnologías.

No define microservicios.

No define bases de datos.

Define cómo pensamos el producto.

---

# Resumen Ejecutivo

CajuEat no es una aplicación.

CajuEat es un ecosistema compuesto por varios productos que evolucionan de forma independiente.

Desde el primer día debemos separar claramente:

- Brain
- Platform
- PWA

Esta separación permitirá que el Brain pueda sobrevivir durante muchos años independientemente de las interfaces que lo consuman.

---

# Filosofía

El error más común en productos con IA es mezclar inteligencia con interfaz.

Nosotros hacemos exactamente lo contrario.

La interfaz es descartable.

El Brain es permanente.

---

# Arquitectura Conceptual

```text
                +------------------+
                |      Brain       |
                +------------------+
                         ▲
                         │
                +------------------+
                |     Platform     |
                +------------------+
                         ▲
                         │
         +---------------+---------------+
         │               │               │
     PWA (MVP)      Chat (Future)   Voice (Future)
```

El Brain nunca depende de un cliente.

Los clientes dependen del Brain.

---

# Producto 1 — Brain

## Objetivo

Pensar.

Aprender.

Recordar.

Recomendar.

Explicar.

El Brain es el activo principal de la empresa.

---

## Responsabilidades

- Comprender intención.
- Resolver contexto.
- Recordar usuarios.
- Aprender continuamente.
- Recomendar.
- Comparar.
- Planificar.
- Explicar recomendaciones.
- Detectar contradicciones.
- Aprender de fuentes externas.
- Aprender de la comunidad.

---

## Lo que NO hace

No renderiza pantallas.

No conoce botones.

No conoce React.

No conoce la PWA.

No sabe si la conversación ocurre por voz o texto.

---

# Producto 2 — Platform

## Objetivo

Conectar todo el ecosistema.

---

## Responsabilidades

- Usuarios.
- Autenticación.
- Notificaciones.
- Analytics.
- CMS.
- Gamificación.
- Integraciones.
- Sincronización.
- Configuración.
- Administración.

La Platform nunca toma decisiones gastronómicas.

Eso siempre pertenece al Brain.

---

# Producto 3 — PWA

## Objetivo

Ser la mejor forma de interactuar con el Brain.

---

## Responsabilidades

- UX.
- UI.
- Navegación.
- Animaciones.
- Gestos.
- Mapa.
- Conversación.
- Visualización.

---

## Lo que NO hace

No decide.

No recomienda.

No aprende.

Todo eso pertenece al Brain.

---

# ¿Por qué una PWA?

La decisión fue tomada pensando en velocidad.

Beneficios:

- distribución inmediata;
- sin App Store;
- menor costo;
- iteración rápida;
- instalación sencilla;
- un único código;
- suficiente para el MVP.

En el futuro podrían existir aplicaciones nativas.

Pero el Brain no cambia.

---

# Futuras Interfaces

El Brain debería poder ser utilizado por:

- PWA
- App nativa
- Chat
- WhatsApp
- Asistente de voz
- API pública
- Integraciones
- Agentes IA
- Wearables

Todas consumen el mismo Brain.

---

# CMS Conversacional

Una decisión importante.

No queremos un Backoffice tradicional lleno de formularios.

Queremos que alimentar el Brain sea una conversación.

Ejemplos.

> "Agregá este restaurante."

> "Analizá este Reel."

> "Importá esta lista."

> "Este menú cambió."

El CMS debe sentirse como hablar con un asistente.

---

# Alimentación del Brain

El conocimiento puede ingresar mediante:

- conversación;
- voz;
- imágenes;
- links;
- Reels;
- TikToks;
- Instagram;
- YouTube;
- PDFs;
- artículos;
- listas;
- correcciones de usuarios.

La prioridad siempre será reducir la fricción para alimentar conocimiento.

---

# Evolución Independiente

Cada producto evoluciona por separado.

Ejemplo.

Podemos lanzar una app de voz.

El Brain sigue siendo exactamente el mismo.

---

# Principios de Separación

## La inteligencia vive únicamente en el Brain.

## La experiencia vive en la PWA.

## La infraestructura vive en Platform.

## Ningún módulo invade responsabilidades ajenas.

---

# Beneficios

Esta separación permite:

- reutilización;
- escalabilidad;
- múltiples interfaces;
- menor deuda técnica;
- evolución independiente;
- mayor claridad conceptual.

---

# Casos de Uso

## Caso 1

El usuario pregunta:

> Quiero comer sushi.

La PWA no responde.

La pregunta llega al Brain.

El Brain responde.

La PWA únicamente muestra la respuesta.

---

## Caso 2

Un usuario comparte un Reel.

La PWA captura el contenido.

La Platform lo envía.

El Brain aprende.

---

## Caso 3

En el futuro aparece un asistente de voz.

No hay que reconstruir inteligencia.

Solo consumir el mismo Brain.

---

# Reglas del Producto

- Nunca duplicar lógica del Brain en clientes.
- Nunca mezclar UI con conocimiento.
- Toda nueva interfaz debe consumir el mismo Brain.
- El Brain siempre es el centro del ecosistema.

---

# Decisiones Tomadas

✅ Brain separado del producto.

✅ PWA como primer cliente.

✅ CMS conversacional.

✅ Brain independiente de tecnología.

✅ Arquitectura orientada a múltiples clientes.

---

# Decisiones Abiertas

- Nombre definitivo de Platform.
- APIs públicas.
- SDK oficial.
- Marketplace futuro.
- Plugins del Brain.

---

# Qué NO hacer

No crear lógica de negocio dentro de la PWA.

No copiar funcionalidades entre clientes.

No hacer que el Brain dependa de tecnologías específicas.

No pensar el producto únicamente como una aplicación.

---

# Documentos Derivados

Este Context Pack alimenta:

- architecture.md
- product.md
- brain.md
- codex-brief.md
- design-brief.md

---

# Estado

Este documento define la arquitectura conceptual del producto.

No debe confundirse con arquitectura técnica.

La arquitectura técnica será responsabilidad de Claude Code.
