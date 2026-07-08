# SPEC-023 — Puntos como Crédito Canjeable y Liquidación con Comercios (nueva)

**Status:** Draft — requiere validación legal/financiera antes de pasar a implementación, ver advertencia abajo
**Priority:** P3
**Owner:** Producto + Legal/Finanzas (no Claude Code — ver advertencia)
**Consumers:** Claude Code (solo Fase 1, ver alcance)

Depends On

- SPEC-020 QR Check-in
- SPEC-021 Pasaporte de Cafés
- gamification.md / product-decisions.md (Decisión abierta #4)

---

# ⚠️ Advertencia — leer antes de construir cualquier cosa acá

Este spec describe **mover dinero real** entre CajuEat, el usuario y el comercio: el usuario "gasta" crédito, CajuEat le paga (o le debe) esa plata al local, potencialmente reteniendo un margen. Eso ya no es una feature de producto — es una operación financiera con implicancias reales:

- Sostener saldos de usuarios que representan valor monetario (aunque se llamen "puntos") puede caer bajo regulación de instrumentos prepagos o dinero electrónico según la jurisdicción — esto varía y requiere asesoría legal real, no una decisión de ingeniería.
- Pagar a comercios por transacciones de terceros normalmente requiere un procesador de pagos real (Stripe Connect u homólogo, o un esquema de facturación entre partes) — no es algo que se resuelva con una tabla en una base de datos.
- Un porcentaje de markup "configurable desde el Admin" implica que CajuEat factura o retiene una comisión — esto tiene implicancias impositivas reales.

**Este documento no construye la ejecución real de pagos.** Define el modelo de producto y dejarlo listo para implementar, pero la Fase 2 (pagos automáticos reales) explícitamente no se arranca sin que el usuario confirme que ya resolvió la parte legal/financiera — no es una decisión que un asistente de código deba tomar ni asumir.

---

# Objetivo

Que los Caju Points dejen de ser solo un contador de gamificación y se conviertan en crédito real canjeable por productos en los locales adheridos — resolviendo, en parte, la Decisión abierta #4 de `product-decisions.md` ("si existen... recompensas canjeables").

---

# Fase 1 — Lo que se puede construir ya, sin tocar dinero real

Todo lo de acá es producto/software puro, sin fricción legal, y es un prerequisito real de cualquier Fase 2 futura — sin esto, tampoco habría forma de auditar cuánto se le debería pagar a cada local.

## Comportamiento

1. El Admin define, por restaurante o global, una **tasa de conversión** (ej. "100 Caju Points = $500 de crédito") — configurable, nunca hardcodeada.
2. El usuario ve su crédito disponible en Profile, calculado a partir de sus puntos según la tasa vigente — nunca un número aparte que se pueda desincronizar del balance real de puntos.
3. **Redención**: el usuario, en el mostrador, elige "usar mi crédito" en la app y escanea el mismo QR de check-in (SPEC-020) — pero esta vez en modo redención, no modo check-in. El scan exige, igual que el check-in, geolocalización real y timestamp de servidor — no se puede redimir crédito sin estar físicamente ahí, por la misma razón que no se puede dejar un review sin haber ido.
4. El Brain registra una **Redención** real: `{ userId, restaurantId, pointsSpent, creditValue, redeemedAt }` — inmutable, igual que un check-in.
5. Los puntos se descuentan del balance del usuario en el momento de la redención — no antes (elegir "quiero canjear" sin completar el scan no descuenta nada).
6. El Admin tiene un panel de **Liquidaciones pendientes**: la suma de crédito redimido por local, en un período, con el markup configurado ya calculado — para que el operador humano pueda pagarle al local por fuera de la app (transferencia, efectivo, lo que ya usen) mientras no exista Fase 2. Esto ya resuelve el pedido de "un porcentaje de markup configurable" sin necesitar mover un peso automáticamente.

## Qué SÍ resuelve la Fase 1

- Auditoría real y completa de cuánto crédito se generó, se usó, y qué le corresponde a cada local — con evidencia de check-in/redención real, nunca estimada.
- Cero riesgo legal nuevo — no se mueve dinero automáticamente, es un panel de reporte que un humano usa para pagar como ya paga hoy cualquier otra cosa.

---

# Fase 2 — Pagos automáticos (explícitamente fuera de alcance de este spec)

Automatizar el pago real al local (vía un procesador de pagos, transferencia programática, o facturación electrónica) — **no se especifica en detalle acá** porque depende de una decisión de negocio (qué procesador, qué entidad legal factura, cómo se retiene el markup) que todavía no está tomada. Cuando esa decisión exista, este spec se actualiza con el mecanismo real elegido.

---

# Qué NO hace este spec

No define la tasa de conversión exacta puntos→crédito (Decisión abierta #4, heredada). No implementa ningún pago automático (Fase 2, explícitamente fuera de alcance). No resuelve qué pasa si un usuario acumula crédito y el local se da de baja del programa (Open Question). No asume ningún procesador de pagos específico.

---

# Acceptance Criteria (solo Fase 1)

✓ El crédito disponible de un usuario siempre se deriva de su balance real de puntos y la tasa vigente — nunca un valor guardado aparte que pueda desincronizarse.

✓ Una redención exige el mismo nivel de verificación real que un check-in (geolocalización + timestamp de servidor) — nunca se descuentan puntos sin un scan válido.

✓ Los puntos se descuentan en el momento exacto de la redención confirmada, nunca antes.

✓ El panel de liquidaciones en Admin muestra, por local y por período, el crédito redimido real y el markup ya calculado — sin necesitar ningún cálculo manual del operador.

✓ Ninguna redención mueve dinero real de forma automática — la Fase 1 es 100% reporte + registro, el pago ocurre fuera de la app.

---

# Open Questions

- Qué pasa con el crédito de un usuario si un local se da de baja antes de que lo use — ¿se pierde, se puede redimir en cualquier otro local del programa, o se convierte de nuevo en puntos? Es una decisión de producto real, no técnica.
- Tasa de conversión: ¿global para todo el catálogo, o configurable por local? El pedido original sugiere que el markup sí es configurable — la tasa de conversión podría serlo también, pero complica la experiencia del usuario (mismo punto vale distinto según dónde lo gaste). Recomendación: empezar con una tasa global única, dejar por-local para una iteración futura si hace falta.
- Fase 2 completa (mecanismo de pago real) — deliberadamente sin especificar hasta que exista una decisión de negocio/legal tomada.

---

# Notas para Claude Code

Solo implementar Fase 1 sin pedido explícito adicional del usuario, y solo después de que exista `SPEC-020` (check-ins) funcionando de verdad — la redención reusa exactamente el mismo flujo de scan, solo cambia el modo. Nuevo store `redemptionsStore.ts`, mismo patrón JSON-persistido. Nunca construir nada de Fase 2 (integración con un procesador de pagos real, movimiento de dinero automático) sin que el usuario lo pida explícitamente y confirme que la parte legal ya está resuelta — no es una decisión de ingeniería a tomar por cuenta propia.
