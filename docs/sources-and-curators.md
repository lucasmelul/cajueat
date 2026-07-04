# Fuentes y Curadores

Una idea clave del producto: nutrir al Brain con listas depuradas de foodies, influencers y medios especializados, tratándolos como una fuente de señal — no como una autoridad a copiar.

## La idea central

El Brain puede tomar listas de lugares recomendados por curadores gastronómicos y usarlas como señales fuertes o medias dentro del [Trust Engine](trust-engine.md).

Ejemplos de curadores mencionados durante la definición del producto:

- @buenospaladaires_
- @salt_argentina

Estos son ejemplos ilustrativos, no una lista cerrada ni una integración comprometida.

## No copiar rankings. Aprender de ellos.

El objetivo no es replicar el ranking de un influencer dentro de CajuEat. El objetivo es que el Brain aprenda:

> En quién confiar, para qué dominio, para qué usuario y en qué contexto.

## Source Entity

Cada influencer o curador se modela como una **Source Entity** dentro del Experience Graph (ver [knowledge.md](knowledge.md)).

Atributos posibles de una Source Entity:

- dominios donde es fuerte (ej: parrillas, cocina asiática, brunch);
- barrios que cubre;
- tipo de cocina que mejor domina;
- estilo (curatorial, popular, técnico, etc.);
- sesgos conocidos;
- consistencia histórica (¿sus recomendaciones se sostienen en el tiempo?);
- coincidencia con la comunidad de CajuEat;
- coincidencia con los gustos de un usuario en particular.

## Ejemplo de uso

Si un restaurante aparece recomendado por Buenos Paladaires, Salt Argentina y varios usuarios de Caju de forma independiente, su nivel de confianza sube — no porque "muchas fuentes dicen lo mismo" de forma genérica, sino porque el Trust Engine reconoce que son fuentes de perfiles distintos convergiendo en la misma señal.

## Relación con otros documentos

- [trust-engine.md](trust-engine.md) — cómo se pondera esta señal frente a otras.
- [knowledge.md](knowledge.md) — cómo se modelan Source, Influencer y Curated List como entidades.
- [PRD-007 — Sources & Curators](prds/PRD-007-sources-and-curators.md) — especificación funcional de la versión MVP.

## Decisiones abiertas

- Qué fuentes específicas se incorporan primero, y si hay o no un proceso de curación editorial humana antes del lanzamiento, es una decisión de producto/operaciones aún no tomada. Ver [product-decisions.md](product-decisions.md).
- Si existe algún tipo de relación formal (partnership, atribución pública) con las fuentes usadas, o si el uso es puramente interno como señal, también queda abierto.
