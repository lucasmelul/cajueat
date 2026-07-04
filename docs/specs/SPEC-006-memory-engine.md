# SPEC-006 — Memory Engine

**Status:** Draft
**Priority:** P0
**Owner:** Product
**Consumers:** Claude Code

---

# Objetivo

Definir cómo el Brain construye, mantiene y utiliza la memoria del usuario.

La memoria es el principal mecanismo de personalización de CajuEat.

No es un historial.

No es una base de datos.

Es el modelo mental que el Brain tiene sobre una persona.

---

# Filosofía

El Brain nunca memoriza todo.

Memoriza únicamente aquello que mejora futuras decisiones.

Recordar demasiado genera ruido.

Recordar poco genera recomendaciones genéricas.

---

# Responsabilidades

El Memory Engine debe:

- crear memoria;
- actualizar memoria;
- olvidar memoria;
- resolver contradicciones;
- explicar memoria;
- utilizar memoria.

---

# Qué NO es memoria

No guardar.

- todas las conversaciones;
- todos los clics;
- todos los movimientos.

Eso pertenece al historial.

---

# Qué SÍ es memoria

Información útil.

Ejemplos.

- le gusta el sushi tradicional;
- evita lugares muy ruidosos;
- suele salir los viernes;
- prefiere barras antes que mesas;
- suele gastar entre $$$ y $$$$;
- disfruta cafeterías para trabajar.

---

# Tipos de Memoria

## Preferencias

Ejemplo.

Ama ramen.

---

## Restricciones

Vegetariano.

Sin TACC.

No alcohol.

---

## Hábitos

Sale los domingos.

---

## Patrones

Siempre pide omakase.

---

## Contextuales

Cuando llueve.

Busca cafeterías.

---

## Temporales

Está organizando un cumpleaños.

Caduca.

---

## Permanentes

Difíciles de modificar.

---

# Creación

La memoria puede surgir desde.

Conversación.

↓

Feedback.

↓

Colecciones.

↓

Experiencias.

↓

Comparaciones.

↓

Importaciones.

↓

Correcciones.

---

# Nunca crear memoria por una sola acción

Ejemplo.

Visitó una hamburguesería.

↓

No significa.

Le encantan las hamburguesas.

---

# Evidencia

Toda memoria necesita evidencia.

Mientras más evidencia.

Mayor confianza.

---

# Confianza

Cada memoria posee.

Confidence.

Origin.

Evidence.

Updated At.

---

# Actualización

Una memoria puede.

Subir.

↓

Bajar.

↓

Fusionarse.

↓

Eliminarse.

↓

Caducar.

---

# Contradicciones

Ejemplo.

Memoria.

Ama sushi.

↓

Últimos diez restaurantes.

Italianos.

↓

No borrar.

↓

Construir hipótesis.

---

# Explicabilidad

El usuario puede preguntar.

¿Por qué pensás que me gusta esto?

↓

El Brain responde.

---

# Corrección

El usuario puede decir.

"No me gusta más."

↓

Actualizar inmediatamente.

---

# Forgetting

El Brain también olvida.

Información vieja.

Información irrelevante.

Información superada.

---

# Uso

La memoria nunca aparece sola.

Siempre participa en.

Recomendaciones.

Comparaciones.

Conversaciones.

Planning.

Feedback.

---

# Cold Start

Usuario nuevo.

↓

Memoria casi vacía.

↓

Contexto.

↓

Hipótesis.

↓

Aprendizaje.

---

# Privacidad

Toda memoria pertenece al usuario.

Debe poder.

Ver.

Editar.

Eliminar.

Exportar.

---

# Analytics

Memory Created

Memory Updated

Memory Removed

Memory Used

Memory Corrected

Memory Confirmed

---

# Performance

Consulta.

<100 ms.

---

# Acceptance Criteria

✓ Nunca memorizar ruido.

✓ Toda memoria posee evidencia.

✓ Toda memoria puede corregirse.

✓ Toda memoria mejora recomendaciones.

✓ El usuario mantiene el control.

---

# Open Questions

Decay automático.

Versionado.

Memoria compartida.

Memoria familiar.

---

# Notas para Claude Design

La memoria nunca debe sentirse invasiva.

Debe sentirse útil.

Cuando el usuario la vea.

Debe pensar.

"Caju realmente me conoce."

No.

"Caju me está vigilando."

---

# Notas para Claude Code

No implementar la memoria como un simple perfil de usuario.

Debe ser un sistema vivo.

Capaz de:

- evolucionar;
- cambiar confianza;
- resolver contradicciones;
- olvidar;
- justificar decisiones.

La implementación queda abierta.

Lo importante es respetar el comportamiento definido.
