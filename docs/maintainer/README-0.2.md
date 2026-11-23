# company-os

Súborový Second Brain a pracovný systém firmy pre lokálny Codex alebo Claude Code, s voliteľným Obsidianom.

**Základ `0.2.0-simple.1` sa inštaluje prevzatím hotových súborov.** Vytvorí slovenské profily, mapu systému, pracovnú tabuľu, pravidlá pre AI a jeden model nastavenia firmy. Účastník nepotrebuje Node, Git ani Python a nezadáva príkazy do terminálu. Príkazy potrebné na prenos súborov vykonáva agent nástrojmi klienta a operačného systému.

## Začnite tu

1. Vytvorte prázdny priečinok, napríklad `Moja firma` v Dokumentoch.
2. Otvorte ho ako projekt v prihlásenom lokálnom Codexe alebo Claude Code.
3. Vložte tento prompt:

```text
V tomto otvorenom priečinku nainštaluj company-os podľa https://github.com/tomasmartincok/company-os/blob/main/INSTALL.md. Prevezmi pripravené súbory bez Node. Existujúce údaje zachovaj. Ponúkni mi voliteľnú synchronizáciu s cloudom; ak ju nemám nastavenú, pokračuj lokálne. Po overení ma veď prvou otázkou z pracovnej tabule.
```

Agent overí priečinok, prevezme súbory z konkrétneho GitHub commitu a skontroluje ich. Pri už nainštalovanej rovnakej verzii iba preverí stav. Starší alebo neúplný priestor vyžaduje konkrétny plán; údaje sa automaticky neprepisujú. Klient môže vyžiadať vlastné povolenie siete alebo priečinka. Bežný webový chat potrebuje lokálne súborové nástroje, aby mohol túto inštaláciu vykonať.

Po inštalácii otvorte `Začnite tu.md`. Otázky a úlohy sú na jedinej pracovnej tabuli, potvrdené odpovede sa ukladajú do profilov. V novom chate pokračujte z otvoreného koreňa firmy. Voliteľne ho môžete otvoriť ako samostatný trezor v Obsidiane.

## Voliteľný cloud

Môžete začať v už nastavenom OneDrive, Dropboxe alebo Google Drive, ak sú súbory dostupné aj lokálne. Ak cloud ešte nemáte nastavený, pokračujte lokálne; na tabuli zostane úloha **Nastaviť synchronizáciu a zálohovanie**. Agent vás navedie, účet a presun hotového priečinka sa riešia osobitne. Samotné uloženie do Dokumentov nepotvrdzuje synchronizáciu. Synchronizácia prenáša aj zmazanie, preto si overte možnosti obnovy.

[Postup pre agenta](INSTALL.md) · [Rozsah a výsledky overenia](docs/simple-install.md) · [Špecifikácia v1.8](docs/specifikacia.md)

Oliver, ďalšie dva procesové modely, generátor/manuál a plné prepojenie účastníckych materiálov sú ďalšou etapou. Skutočné skúšky Windows, Claude Code, cloudu a netechnického účastníka majú vlastný stav dôkazov v reporte. [Pôvodný foundation release](docs/core-foundation.md) zostáva historickým vydaním s iným spôsobom inštalácie.

## Účastnícky modul

Samostatný obsahový modul obsahuje sedem promptov P1–P7, tri fiktívne vetvy, vstupy A/B, Markdown, HTML portál a fragment do Začnite tu. Zatiaľ sa zostavuje samostatne; nový základ ho automaticky neinštaluje. [Zostavenie](scripts/WORKSHOP.md) · [Stav overenia](docs/workshop-module-status.md)

## Pre udržiavateľa

Node slúži na zostavenie a testy správcu, bez npm závislostí. Účastník preberá výsledok v `starter/`; tento odvodený priečinok sa ručne neupravuje. Kanonika je v modeli, schéme a šablónach. Vývojové príkazy:

```sh
node scripts/build-starter.mjs
node --test tests/*.test.mjs
```

Verejný zdroj a kontrolné súčty nepredstavujú nezávislý podpis autora. Workshop môže použiť konkrétny commit od organizátora. Licenčná voľba startera zostáva otvoreným bodom špecifikácie. Súkromný pracovný priestor firmy sa na GitHub automaticky neodosiela. Audit prompt sa do repozitára nepridáva.
