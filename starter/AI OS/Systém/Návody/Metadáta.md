---
type: "guide"
status: "draft"
created: "2026-10-15"
updated: "2026-10-15"
owner: "neurčený"
source: "company-os 0.2.0-simple.1"
ai-generated: true
tags: ["guide","🤖"]
---

# Metadáta poznámok

> **Súvisí s:** [[Mapa systému.md|Mapa systému]]

Tento návod je odvodený z [[AI OS/Systém/Schémy/poznamka.schema.json|jedinej základnej schémy]].

Povinné polia: `type`, `status`, `created`, `updated`, `owner`, `source`, `ai-generated`, `tags`. Typy: identity, company, map, board, guide, tool, preparation, note, daily, client, project, index, knowledge, idea, log. ISO dátum YYYY-MM-DD, potvrdený owner alebo neurčený, skutočný pôvod alebo nezistené, boolean ai-generated a zoznam tagov s 🤖 pre AI text. Status draft/active/archived nie je schválenie výsledku.

Základný validator podporuje skalárne properties, JSON/YAML flow stringové zoznamy, block stringové zoznamy a mapu company-os-extra-fields. Nepodporované YAML konštrukcie majú checkpoint, obsah nezmaže. Firemné custom- typy/polia deklaruj iba vo frontmatter Mapy; nemôžu oslabiť základ. Knowledge potrebuje sources a certainty. Technické AGENTS/import/model/JSON a nemenné raw zdroje nepodliehajú note frontmatter.

Pod H1 pridaj Súvisí s s relevantným root odkazom. Nová poznámka potrebuje spätný indexový odkaz; budúce súbory neodkazuj ako hotové.
