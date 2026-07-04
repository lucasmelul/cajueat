# CP-015 — Restaurant Entity Model

**Estado:** Draft
**Versión:** 1.0
**Owner:** Product
**Consumidores:** Claude Code, Claude Design, Product

---

# Objetivo

Definir qué representa un restaurante dentro del Brain.

Para CajuEat un restaurante no es un negocio.

Es una entidad viva que acumula conocimiento, cambia con el tiempo y genera experiencias.

Todo el sistema gira alrededor de esta entidad.

---

# Filosofía

No queremos modelar negocios.

Queremos modelar experiencias.

El restaurante es solamente el escenario donde ocurre una experiencia gastronómica.

---

# Identidad

Todo restaurante posee una identidad.

Ejemplos.

- nombre
- ubicación
- concepto
- historia
- personalidad
- cocina
- ambiente
- propuesta gastronómica

Pero además posee conocimiento.

---

# El Restaurante NO es una Ficha

No queremos una estructura del tipo.

Nombre

↓

Dirección

↓

Teléfono

↓

Reviews

↓

Fotos

Eso ya existe.

Queremos responder.

¿Por qué existe este lugar?

---

# Personalidad

Todo restaurante debería poder describirse como si fuera una persona.

Ejemplos.

- elegante
- relajado
- experimental
- clásico
- ruidoso
- íntimo
- tradicional
- moderno

---

# Especialidades

El Brain debe conocer.

No solamente:

Sirve sushi.

Sino:

Por qué vale la pena pedir sushi ahí.

---

Ejemplos.

Especialidad absoluta.

Muy recomendado.

Aceptable.

Evitar.

---

# Momentos

Cada restaurante tiene momentos ideales.

Ejemplos.

- desayuno
- brunch
- almuerzo
- merienda
- sunset
- cena
- after office
- madrugada

---

# Público

Ideal para.

- pareja
- familia
- trabajo
- turistas
- grupos grandes
- primera cita
- cumpleaños
- solo

---

# Ticket

El precio nunca debe representarse únicamente como $$$.

Debe existir conocimiento.

Ejemplos.

Excelente relación precio/calidad.

Vale cada peso.

Muy caro para lo que ofrece.

---

# Ambiente

Debe conocerse.

- iluminación
- ruido
- música
- velocidad
- comodidad
- privacidad
- accesibilidad
- temperatura
- terraza
- vista

---

# Servicio

No una nota.

Sino conocimiento.

Ejemplos.

Muy atentos.

Lentos.

Excelente sommelier.

Servicio inconsistente.

---

# Cocina

Debe modelarse.

- chef
- estilo
- técnicas
- ingredientes
- estacionalidad
- creatividad
- consistencia

---

# Evolución

Todo restaurante cambia.

Ejemplos.

Nuevo chef.

Nueva carta.

Nueva terraza.

Cambio de concepto.

Reforma.

Mudanza.

Sucursal nueva.

El Brain mantiene esa historia.

---

# Conocimiento Asociado

El restaurante se relaciona con.

- platos
- chefs
- vinos
- ingredientes
- experiencias
- usuarios
- barrios
- listas
- influencers
- eventos

---

# Señales

El Brain aprende continuamente.

Ejemplos.

- espera promedio
- platos agotados
- horarios reales
- cambios de calidad
- tendencias
- nuevas recomendaciones

---

# Recomendaciones

Todo restaurante debe responder automáticamente.

- qué pedir
- cuándo ir
- con quién ir
- cuánto gastar
- cuánto esperar
- dónde sentarse
- qué evitar

---

# Comparaciones

Todo restaurante debe poder compararse con cualquier otro.

No mediante estrellas.

Mediante criterio.

---

# Similares

El Brain debe conocer restaurantes similares.

No por categoría.

Por experiencia.

---

# Complementarios

También debe conocer.

Después de cenar acá.

Podrías ir a...

- heladería
- bar
- cafetería
- paseo

---

# Preguntas Frecuentes

El Brain debe responder.

¿Vale la pena?

¿Reservo?

¿Es turístico?

¿Es mejor al mediodía?

¿Conviene pedir degustación?

---

# Objetivos

Construir la representación gastronómica más completa posible de un restaurante.

No solamente una ficha comercial.

---

# Reglas

- Todo restaurante evoluciona.
- Todo restaurante aprende.
- Toda afirmación tiene evidencia.
- Todo restaurante posee personalidad.
- Toda entidad se conecta con otras.

---

# Decisiones Tomadas

✅ El restaurante es una entidad viva.

✅ La experiencia tiene prioridad sobre los datos.

✅ El Brain mantiene historial.

✅ La personalidad forma parte del modelo.

---

# Decisiones Abiertas

- Score interno.
- Timeline visual.
- Modelado de sucursales.
- Experiencias compartidas.

---

# Qué NO hacer

No copiar Google Places.

No copiar TripAdvisor.

No reducir el restaurante a una ficha.

---

# Documentos Derivados

- restaurant.md
- ontology.md
- PRD-003

---

# Estado

El restaurante constituye la entidad central del universo gastronómico de CajuEat y será uno de los pilares del Knowledge Graph.
