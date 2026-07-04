# CP-028 — Authentication & Identity

**Estado:** Draft
**Versión:** 1.0
**Owner:** Product
**Consumidores:** Claude Code, Claude Design

---

# Objetivo

Definir cómo el usuario crea su identidad dentro de CajuEat.

La autenticación debe ser casi invisible.

No queremos que registrarse sea una barrera.

---

# Filosofía

El usuario quiere descubrir un restaurante.

No quiere crear una cuenta.

La autenticación debe aparecer únicamente cuando aporte valor.

---

# Principios

- mínima fricción;
- menos de 30 segundos;
- sin contraseñas;
- mobile first;
- segura.

---

# Estrategia

El MVP prioriza simplicidad.

La opción preferida actualmente es:

Login mediante número de teléfono + OTP.

Opciones futuras:

- Google
- Apple
- Passkeys

---

# Cuándo pedir login

Idealmente luego de que el usuario ya percibió valor.

Ejemplos.

- guardar restaurante;
- crear colección;
- dejar feedback.

---

# Qué NO hacer

- contraseña;
- confirmación por email;
- formularios largos.

---

# Decisiones Tomadas

🟡 Prioridad a login por teléfono.

---

# Decisiones Abiertas

- Passkeys.
- Google.
- Apple.

---

# Documentos Derivados

- auth.md
- onboarding.md

---

# Estado

La autenticación debe sentirse como un detalle y no como un paso obligatorio.
