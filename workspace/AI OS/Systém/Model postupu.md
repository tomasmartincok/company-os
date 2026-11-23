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

# Model postupu

> **Súvisí s:** [[AI OS/Tím/asistent/profil.md|Hlavný asistent]] · [[AI OS/Systém/Šablóna profilu.md|Šablóna profilu]]

Každý pracovný postup má priečinok `AI OS/Postupy/<id>/`. Jediný zdroj je `model.yaml`. Z neho číta AI pri práci aj `AI OS/Manuál.html` pri zobrazení.

## Súbory postupu

| Súbor | Úloha |
|---|---|
| `model.yaml` | zdroj; iba tento súbor sa upravuje |
| `model.js` | presná kópia modelu pre manuál; ručne sa nemení |

`<id>` aj ID krokov sú bez diakritiky a medzier. ID postupu: malé písmená, číslice, pomlčky. ID kroku: malé písmená, číslice, podčiarkovník.

## Tvar modelu

```yaml
schemaVersion: 1
process:
  id: priprava-ponuky
  title: Príprava cenovej ponuky
  version: "1.0"
  updated: "2026-11-23"
  owner: Meno človeka, ktorý za postup zodpovedá
  trigger: Čo postup spúšťa.
  input: Čo musí byť k dispozícii.
  output: Čo má vzniknúť.
  description: Jedna až dve vety, na čo postup slúži.
  start: prvy_krok
owners:            # voliteľné; ak je zoznam uvedený, každý vlastník kroku v ňom musí byť
  - Meno človeka
  - Meno zamestnanca
notes:             # voliteľné; hranice a čo robiť pri chybe
  - Zamestnanec nič neodosiela.
nodes:
  - id: prvy_krok
    type: action            # action, decision alebo terminal
    title: Názov kroku
    map_title: Kratší názov do mapy   # voliteľné
    owner: Meno zamestnanca
    human: false            # true, ak v kroku rozhoduje alebo koná človek
    detail: Čo presne sa má urobiť a z čoho.
    evidence:               # voliteľné; podľa čoho sa spozná, že je hotovo
      - Výsledok je uložený pri klientovi
    branches:
      - label: Pokračovať
        target: dalsi_krok
```

Pravidlá, ktoré manuál kontroluje:

- `action` má aspoň jednu vetvu, `decision` aspoň dve, `terminal` žiadnu.
- Každá vetva vedie na existujúci krok.
- Ku každému kroku vedie cesta zo začiatku a z každého kroku sa dá dostať ku koncu.
- Postup má aspoň jeden krok typu `terminal`.
- Model nesmie obsahovať dvojicu znakov `*/`.

Dobrý postup má vstup, výsledok, vlastníka, aspoň jeden krok s `human: true` a vetvu pre prípad, že chýba podklad.

## Po každej zmene modelu

1. Ulož `model.yaml` a zvýš `version` aj `updated`.
2. Vytvor `model.js` nanovo: prvý riadok `CompanyOS.model("<id>", function () {/*`, potom presný obsah `model.yaml` bez akejkoľvek zmeny, posledný riadok `*/});`.
3. Over, že text medzi prvým a posledným riadkom `model.js` je zhodný s `model.yaml`.
4. Pri novom postupe pridaj riadok s jeho ID do `AI OS/Postupy/register.js`.
5. Požiadaj používateľa, aby otvoril alebo obnovil `AI OS/Manuál.html` a potvrdil, že postup vidí bez chybovej hlášky. Ak manuál ukáže chybu, oprav model a zopakuj kroky 1 až 3.

Priečinok `AI OS/Postupy/_citacka/` a súbor `AI OS/Manuál.html` nemeň.
