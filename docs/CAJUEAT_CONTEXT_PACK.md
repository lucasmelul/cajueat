
# CajuEat Context Pack

> Este documento resume el contexto, decisiones, visión y definiciones surgidas en la conversación inicial de CajuEat.  
> Su objetivo es servir como entrada para Codex / Claude Code / Claude Design para reconstruir la documentación definitiva del repositorio.

---

# 1. Qué es CajuEat

CajuEat es una plataforma gastronómica AI-native para ayudar a las personas a descubrir, decidir y vivir mejores experiencias gastronómicas.

No es simplemente una app de restaurantes.  
No es Google Maps.  
No es TripAdvisor.  
No es una red social gastronómica.

CajuEat debe sentirse como un producto moderno, futurista, único y extremadamente simple.

La tesis central:

> CajuEat no muestra listas. CajuEat ayuda a decidir.

---

# 2. Separación fundamental

CajuEat se compone de tres productos:

## 1. Brain

El Brain es el activo principal.

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

El Brain NO conoce interfaces.

Debe poder ser consumido por:

- PWA;
- chat;
- voz;
- API;
- agentes;
- futuras interfaces.

## 2. Platform

La Platform conecta todo:

- autenticación;
- usuarios;
- permisos;
- notificaciones;
- analytics;
- gamificación;
- integraciones;
- CMS;
- operaciones del Brain.

## 3. PWA

La app será una PWA, no una app nativa.

Motivos:

- menor fricción;
- distribución inmediata;
- link shareable;
- menor costo inicial;
- iteración rápida;
- suficiente para MVP.

La PWA es solo el primer cliente del Brain.

---

# 3. Principios de producto

## Brain First

La inteligencia vive en el Brain, no en la interfaz.

## Map First

La Home es el mapa.

El mapa no es una pantalla secundaria.  
Es el punto de entrada al producto.

## Conversation First

La conversación es el lenguaje principal del producto.

Todo debería poder hacerse hablando o escribiendo:

- buscar;
- comparar;
- guardar;
- corregir;
- aportar conocimiento;
- planificar.

## Trust First

La confianza vale más que el crecimiento.

La IA nunca inventa.  
Si no sabe, dice que no sabe.

## Knowledge Compounds

Cada interacción debe mejorar el Brain.

---

# 4. Filosofía de experiencia

La PWA debe sentirse:

- moderna;
- premium;
- futurista;
- simple;
- viva;
- distinta a cualquier app gastronómica tradicional.

Inspiraciones no para copiar, sino para nivel de calidad:

- Apple Maps;
- Arc Browser;
- Linear;
- Raycast;
- Perplexity;
- ChatGPT;
- Airbnb;
- Spotify.

El usuario debería sentir:

> “Nunca usé algo que funcione así.”

---

# 5. Home / Living Map

La Home es un Living Map.

Objetivo:

> En menos de 10 segundos, el usuario debe descubrir algo interesante sin escribir nada.

Elementos principales:

- mapa casi full screen;
- Brain Card flotante;
- Prompt Bar conversacional;
- Context Chips;
- Restaurant Cards;
- recomendaciones vivas.

El mapa no debe mostrar cientos de pins sin sentido.  
Debe mostrar señales relevantes:

- lugares recomendados;
- lugares nuevos;
- lugares guardados;
- lugares visitados;
- eventos gastronómicos;
- colecciones;
- zonas interesantes.

Los pins deben priorizar relevancia, no cantidad.

---

# 6. Conversational Brain

El chat con el Brain es el corazón del producto.

No debe sentirse como un bot genérico.

Debe sentirse como un amigo / concierge gastronómico experto que:

- conoce la ciudad;
- entiende contexto;
- recuerda preferencias;
- explica decisiones;
- admite dudas.

Debe poder responder con:

- texto;
- cards de restaurante;
- comparaciones;
- mapas;
- planes;
- acciones.

No queremos respuestas largas tipo blog.  
Queremos conversaciones cortas, accionables y con criterio.

---

# 7. Restaurant Experience

La ficha de restaurante no debe parecer una ficha técnica.

Debe responder:

- por qué vale la pena;
- qué pedir;
- cuándo ir;
- para quién es;
- qué tener en cuenta;
- qué lo hace especial;
- qué fuentes lo respaldan.

Secciones deseadas:

- Hero visual;
- descripción narrativa generada por el Brain;
- información crítica;
- qué pedir;
- Brain Tips;
- ambiente;
- precio;
- mapa;
- lugares cercanos;
- timeline de cambios;
- fuentes / confianza;
- acciones: guardar, compartir, cómo llegar, agregar a plan.

Evitar protagonismo excesivo de estrellas/reviews.

---

# 8. Knowledge Capture

Agregar conocimiento debe ser muy simple.

No formularios largos.

Entradas:

- voz;
- foto;
- link;
- Reel;
- TikTok;
- Instagram;
- YouTube;
- menú;
- nota;
- PDF en el futuro.

Flujo:

1. Usuario comparte o captura.
2. Brain analiza.
3. Extrae restaurantes, platos, señales y contexto.
4. Pregunta solo si necesita confirmar algo.
5. Aprende.

Objetivo:

> Menos de 30 segundos para aportar conocimiento útil.

---

# 9. Feedback post visita

Después de una experiencia, el usuario no deja una review tradicional.

Tiene una conversación corta.

Ejemplo:

- ¿Esperaste mucho?
- ¿Qué fue lo mejor?
- ¿La terraza estaba abierta?
- ¿Volverías?
- ¿Con quién lo recomendarías?

Máximo 3-4 preguntas.

Luego gana Caju Points.

El usuario debe sentir que ayudó al Brain, no que completó una encuesta.

---

# 10. Caju Points y gamificación

La gamificación existe para mejorar el Brain, no para generar adicción.

Los usuarios ganan puntos por aportar conocimiento:

- feedback;
- confirmar horarios;
- subir fotos útiles;
- compartir menús;
- validar datos;
- responder quizzes;
- descubrir lugares;
- corregir información.

No deben ganar puntos solo por abrir la app o hacer scroll.

Los puntos representan valor aportado al conocimiento.

---

# 11. Quizzes inteligentes

El Brain puede generar micro-quizzes para aprender.

No formularios.

Micro-juegos de 5-20 segundos.

Ejemplos:

- ¿Qué tan ruidoso es este lugar?
- ¿Irías con chicos?
- ¿Cuál de estos platos representa mejor al restaurante?
- ¿Cuánto esperarías por mesa?
- ¿Es buena primera cita?

El Brain pregunta porque necesita aprender, no porque sí.

---

# 12. Fuentes externas e influencers

Una idea clave: nutrir el Brain con listas depuradas de foodies e influencers.

Ejemplos mencionados:

- @buenospaladaires_
- @salt_argentina

El Brain puede tomar listas de lugares recomendados por curadores gastronómicos y usarlas como señales fuertes o medias.

No debe copiar rankings.  
Debe aprender de ellos.

Cada influencer / curador se modela como una Source Entity.

Atributos posibles:

- dominios donde es fuerte;
- barrios que cubre;
- tipo de cocina;
- estilo;
- sesgos;
- consistencia;
- coincidencia con comunidad;
- coincidencia con gustos del usuario.

Ejemplo:

Si un restaurante aparece recomendado por Buenos Paladaires, Salt Argentina y varios usuarios de Caju, su confianza sube.

La clave no es “seguir influencers”, sino aprender:

> En quién confiar, para qué dominio, para qué usuario y en qué contexto.

---

# 13. Trust Engine

El Brain no decide por una única fuente.

Combina señales.

Tipos de señales:

## Fuertes

- usuario realmente fue;
- foto geolocalizada;
- ticket;
- reserva;
- menú actualizado;
- feedback reciente.

## Medias

- Reel;
- video;
- review;
- lista de foodie;
- artículo.

## Débiles

- likes;
- comentarios;
- popularidad;
- tendencias.

El Brain calcula confianza por dato, restaurante, plato, fuente y recomendación.

También detecta contradicciones.

Ejemplo:

Google dice 4.8, pero usuarios recientes y foodies dicen que bajó la calidad.  
El Brain debe detectar tendencia negativa.

---

# 14. Knowledge Graph / Experience Graph

El Brain no guarda solo restaurantes.

Guarda entidades, relaciones, eventos y experiencias.

Entidades:

- Restaurant;
- Dish;
- Chef;
- Menu;
- Ingredient;
- Wine;
- Coffee;
- Dessert;
- Neighborhood;
- City;
- User;
- Visit;
- Experience;
- Source;
- Influencer;
- Curated List;
- Memory;
- Event.

Relaciones:

- Restaurant sirve Dish;
- Dish usa Ingredient;
- Chef trabaja en Restaurant;
- User visitó Restaurant;
- User disfrutó Dish;
- Source recomendó Restaurant;
- Curated List incluye Restaurant;
- Experience ocurrió en Restaurant.

El Experience Graph es central: aprende en qué contexto una experiencia fue buena.

---

# 15. Memory / User Profile

El perfil no es una red social.

Es una forma de que el usuario vea cómo el Brain lo entiende.

Debe incluir:

- ADN gastronómico;
- lugares guardados;
- experiencias;
- aportes;
- Caju Points;
- preferencias editables;
- timeline.

El Brain no guarda conversaciones crudas; guarda aprendizajes útiles.

Ejemplo:

No guardar: “Lucas habló de sushi”.  
Guardar: “Lucas prefiere sushi tradicional antes que rolls con mucho queso crema”.

---

# 16. Onboarding

Debe ser mínimo.

No tutoriales largos.

La app abre en el mapa.

El Brain saluda y explica brevemente:

> Soy Caju. Voy a ayudarte a descubrir lugares increíbles para comer.

Cold start:

No cuestionario largo.  
Solo 2-3 preguntas conversacionales opcionales:

- qué comida disfruta;
- tipo de salida frecuente;
- zonas habituales.

---

# 17. Autenticación

Decisión abierta, pero el usuario sugirió simplificar y posiblemente usar solo teléfono.

Producto deseado:

- login en menos de 30 segundos;
- que no se sienta como registrarse;
- posiblemente OTP;
- evitar usuario/contraseña.

Codex/Claude Code puede analizar ingeniería, pero la decisión de producto debe priorizar simplicidad.

---

# 18. MVP Scope

MVP real debe ser pequeño pero diferencial.

Incluir:

- PWA;
- Living Map;
- Prompt Bar;
- Brain Card;
- chat básico con Brain;
- ficha de restaurante;
- guardar lugares;
- capturar conocimiento;
- feedback conversacional;
- Caju Points básicos;
- fuentes/Trust Engine en versión simple.

Postergar:

- reservas;
- delivery;
- red social;
- planificación compleja;
- amigos;
- ranking avanzado;
- múltiples ciudades;
- API pública.

---

# 19. Rol de Codex / Claude Code

No queremos darle toda la ingeniería cocinada.

Nosotros definimos producto:

- qué hace;
- cómo se siente;
- qué entra en MVP;
- flujos;
- decisiones UX;
- prioridades.

Codex / Claude Code debe actuar como CTO:

- leer documentación;
- proponer arquitectura;
- elegir stack;
- justificar decisiones;
- diseñar datos, APIs, servicios, tests;
- implementar.

No imponerle desde producto: base de datos, API style, infra o frameworks salvo que haya una razón fuerte.

---

# 20. Rol de Claude Design

Claude Design debe recibir:

- visión;
- principios de UX;
- MVP Scope;
- PRDs;
- Design Brief.

No debe inventar funcionalidades centrales.  
Debe proponer la mejor experiencia visual e interactiva.

---

# 21. Documentos definitivos a crear

Prioridad de documentación:

1. README.md
2. MASTERPLAN.md
3. vision.md
4. product.md
5. brain.md
6. experience-principles.md
7. knowledge.md
8. trust-engine.md
9. sources-and-curators.md
10. gamification.md
11. mvp.md
12. roadmap.md
13. product-decisions.md
14. design-brief.md
15. codex-brief.md

PRDs iniciales:

- PRD-001 Home / Living Map
- PRD-002 Conversational Brain
- PRD-003 Restaurant Experience
- PRD-004 Knowledge Capture
- PRD-005 Post Visit Feedback
- PRD-006 Caju Points
- PRD-007 Sources & Curators
- PRD-008 Trust Engine
- PRD-009 Onboarding
- PRD-010 User Profile

---

# 22. Instrucción sugerida para Codex

Usar este prompt:

```text
Leé docs/CAJUEAT_CONTEXT_PACK.md completo.

Tu tarea NO es programar todavía.

Primero, convertí este context pack en documentación profesional dentro de /docs.

Creá o reemplazá los siguientes archivos:

- docs/README.md
- docs/MASTERPLAN.md
- docs/vision.md
- docs/product.md
- docs/brain.md
- docs/experience-principles.md
- docs/knowledge.md
- docs/trust-engine.md
- docs/sources-and-curators.md
- docs/gamification.md
- docs/mvp.md
- docs/roadmap.md
- docs/product-decisions.md
- docs/design-brief.md
- docs/codex-brief.md

Luego completá /docs/prds con PRD-001 a PRD-010.

Reglas:
- No inventes tecnología todavía.
- No escribas código.
- No hagas arquitectura técnica detallada.
- Consolidá ideas repetidas.
- Convertí conceptos en documentos claros y accionables.
- Marcá decisiones abiertas cuando corresponda.
- Priorizá MVP y simplicidad.
- El output debe ser documentación lista para GitHub.
```

---

# 23. Estado actual del proyecto

El proyecto está en transición de idea/documentación a construcción.

Siguiente paso:

1. Meter este Context Pack en el repo.
2. Pedirle a Codex que genere documentación profesional.
3. Revisar diff.
4. Commit.
5. Recién después pasar a diseño y arquitectura.

