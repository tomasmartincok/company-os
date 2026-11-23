---
type: "guide"
status: "active"
created: "2026-11-23"
updated: "2026-11-23"
owner: "neurčený"
source: "company-os 0.3.0"
ai-generated: true
tags: ["guide", "🤖"]
---

# Metadáta poznámok

> **Súvisí s:** [[AI OS/Systém/Ukladanie.md|Ukladanie]]

Každá nová poznámka začína hlavičkou. Je určená hlavne pre AI, aby vedela, čo je to za dokument, aký je starý a odkiaľ pochádza.

```yaml
---
type: "note"
status: "draft"
created: "2026-11-23"
updated: "2026-11-23"
owner: "meno vlastníka"
source: "odkiaľ obsah pochádza"
ai-generated: true
tags: ["note", "🤖"]
---
```

| Pole | Hodnota |
|---|---|
| `type` | identity, company, board, guide, index, note, daily, client, project, knowledge, idea, tool, log |
| `status` | draft, active, archived. Nie je to schválenie výsledku. |
| `created`, `updated` | dátum v tvare RRRR-MM-DD; `updated` zmeň pri každej úprave |
| `owner` | meno z `O mne.md`; kým nie je známe, „neurčený“ |
| `source` | rozhovor, názov podkladu, odkaz; ak sa nedá zistiť, „nezistené“ |
| `ai-generated` | true, ak text napísala AI |
| `tags` | typ dokumentu a pri texte od AI značka 🤖 |

Poznatok v `Znalosti/Poznatky` má navyše `sources` (zoznam zdrojov) a `certainty` (vysoká, stredná, nízka).

Vlastné typy a polia si používateľ môže pridať. Zapíš ich do tejto tabuľky, aby ich poznal každý ďalší rozhovor.
