# INFORMATION_ARCHITECTURE.md

> Modelo de navegación de la PWA de Lugarcito. Mobile-first, map-first.

---

## Principio

**El mapa es la Home y el centro de gravedad.** Todo empieza y vuelve al mapa (SPEC-001). La navegación es plana y contextual, no un árbol profundo. La conversación y el mapa son dos formas de navegar el mismo Brain.

## Mapa de navegación

```
Living Map (Home)  ◀── centro de todo
├── Prompt Bar  ──▶ Conversation
│                    └── (cards) ──▶ Restaurant Experience
├── Pin tap ──▶ Bottom Sheet (peek ▸ half ▸ full)
│                    └── full ──▶ Restaurant Experience
│                                   ├── ¿Por qué? / Sources
│                                   ├── Cómo llegar (▶ Maps externo)
│                                   └── Preguntar al Brain ──▶ Conversation
├── Context Chips ──▶ recontextualiza el mapa (no navega)
├── Floating Buttons ──▶ ubicación / recentrar / capas
└── Tab Bar
     ├── Mapa            (Home)
     ├── Explorar        ──▶ Conversation
     ├── + Aportar       ──▶ Knowledge Capture (overlay)
     ├── Guardados       ──▶ Profile · guardados
     └── Perfil          ──▶ Profile
                              ├── ADN gastronómico (editable)
                              ├── Guardados
                              ├── Aportes / timeline
                              └── Feedback post-visita (overlay)
```

## Superficies y su tipo

| Superficie | Tipo | Notas |
|---|---|---|
| Living Map | Pantalla raíz | siempre montada; nunca vacía |
| Conversation | Pantalla (push) | vuelve al mapa con back |
| Restaurant Experience | Pantalla (push) | apertura < 500ms, info incremental |
| Bottom Sheet | Overlay sobre el mapa | 3 snaps; el mapa sigue visible |
| Knowledge Capture | Overlay (sheet modal) | desde `+` o el mic de la Prompt Bar |
| Feedback | Overlay (sheet modal) | disparado por el Brain / desde Perfil |
| Profile | Pantalla (tab) | Guardados y Perfil comparten pantalla |

## Reglas

- **La Prompt Bar nunca desaparece** (puede contraerse) — SPEC-001.
- **Una sola Brain Card** a la vez sobre el mapa.
- **Un solo restaurante seleccionado** a la vez.
- **Cómo llegar** abre Google/Apple Maps; no hay navegación propia (SPEC-001).
- **Back / swipe-down / tap-en-mapa** siempre cierran sheets y vuelven al mapa.
- **Zoom cambia contexto**, no solo escala: lejos → barrios, cerca → restaurantes.

## Navegación por conversación (paralela)

Todo lo que se hace tocando también se puede hacer hablando/escribiendo: buscar, comparar, guardar, corregir, aportar, planificar (Conversation First). La Prompt Bar es el atajo universal, disponible desde el mapa.

## Onboarding (mínimo)

Sin tutorial. La app abre en el mapa; el Brain saluda ("Soy Caju…") y ofrece 2-3 preguntas conversacionales **opcionales** (comida preferida, tipo de salida, zonas). El usuario puede explorar de inmediato. Sin ubicación → Buenos Aires con CTA "Usar mi ubicación".

## Fuera del MVP (postergado)

Reservas, delivery, red social, planificación compleja, amigos, ranking avanzado, múltiples ciudades, API pública, Admin/CMS (existe como Platform, no como pantalla de la PWA).
