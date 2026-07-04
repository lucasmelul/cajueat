# Product

CajuEat se compone de tres productos con responsabilidades distintas y deliberadamente separadas. Esta separación es una decisión de producto, no un detalle de implementación: existe para que el Brain nunca quede atado a una interfaz.

## 1. Brain

El Brain es **el activo principal** de CajuEat.

Responsabilidades:

- entender intención;
- entender contexto;
- recordar usuarios;
- aprender de experiencias;
- recomendar;
- explicar;
- comparar;
- planificar;
- nutrirse de fuentes externas;
- construir conocimiento gastronómico propio.

El Brain **no conoce interfaces**. Debe poder ser consumido por PWA, chat, voz, API, agentes y cualquier interfaz futura sin cambiar su forma de razonar.

Ver [brain.md](brain.md) para el detalle de capacidades, entradas y salidas.

## 2. Platform

La Platform conecta todo lo que no es razonamiento puro:

- autenticación;
- usuarios;
- permisos;
- notificaciones;
- analytics;
- gamificación;
- integraciones;
- CMS;
- operación del Brain.

La Platform es la infraestructura de producto que le da al Brain un lugar donde vivir y a los usuarios una identidad persistente.

## 3. PWA

La primera interfaz de CajuEat será una **PWA**, no una app nativa.

Motivos:

- menor fricción de acceso;
- distribución inmediata (un link, sin instalar);
- fácil de compartir;
- menor costo inicial de desarrollo;
- permite iterar más rápido;
- suficiente para validar el MVP.

**La PWA es solo el primer cliente del Brain — no el producto en sí.** El Brain debe diseñarse asumiendo que en el futuro habrá otros clientes (voz, agentes, integraciones de terceros).

## Por qué esta separación importa

Si el Brain se acopla a la PWA, cualquier decisión de UI se convierte en una limitación de inteligencia. Separar los tres productos obliga a que:

- la inteligencia se pueda testear y mejorar independientemente de la interfaz;
- una nueva interfaz (voz, agente, API pública) se pueda construir sin reescribir el razonamiento;
- las decisiones de negocio (auth, notificaciones, puntos) no contaminen el modelo de conocimiento del Brain.
