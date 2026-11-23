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

# Šablóna profilu zamestnanca

> **Súvisí s:** [[AI OS/Tím/README.md|AI tím]] · [[AI OS/Systém/Model postupu.md|Model postupu]]

Profil sa ukladá ako `AI OS/Tím/<id>/profil.md`. `<id>` je krátky názov bez diakritiky a medzier, napríklad `marketing`. Hlavička podľa metadát, typ `guide`.

```markdown
# <Meno> — <oblasť>

> **Súvisí s:** [[AI OS/Tím/README.md|AI tím]] · [[Prehľad firmy.md|Prehľad firmy]]

## Zodpovednosť
Jeden opakovaný výsledok, ktorý má doručovať.

## Z čoho vychádza
Dokumenty a podklady, ktoré si pred prácou prečíta.

## Postupy
Odkazy na `AI OS/Postupy/<id>/model.yaml`. Pri úlohe postupuje podľa modelu.

## Ako sa kontroluje výsledok
Podľa čoho človek spozná dobrý výsledok.

## Kam ukladá výstupy
Konkrétne miesto v priečinku `Práca`.

## Kde rozhoduje človek
Čo zamestnanec nikdy neurobí sám.

## Naučené opravy
Potvrdené trvalé pravidlá z opráv výsledkov, každé s dátumom.
```

Po vytvorení profilu pridaj riadok do tabuľky Tím v `AGENTS.md` a do `AI OS/Tím/README.md`. Profil neudeľuje prístupy ani právomoci.
