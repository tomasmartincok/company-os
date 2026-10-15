---
type: "map"
status: "draft"
created: "2026-10-15"
updated: "2026-10-15"
owner: "neurčený"
source: "company-os 0.2.0-simple.1"
ai-generated: true
tags: ["map","🤖"]
company-os-extra-types: []
company-os-extra-fields: {}
---

# Mapa systému

> **Súvisí s:** [[Začnite tu.md|Začnite tu]] · [[O mne.md|O mne]] · [[Prehľad firmy.md|Prehľad firmy]] · [[Pracovná tabuľa.md|Pracovná tabuľa]]

## Účel a autorita

Súbory sú trvalý kontext, chat je rozhranie. Osobné preferencie sú v O mne, firemné fakty v Prehľade firmy, stav v Pracovnej tabuli. Potvrdené firemné rozhodnutie patrí profilu firmy; klientské/projektové rozhodnutie zostáva pri subjekte. Nástroje držia len overené inventárne údaje. Tento základ nemá ERP ani prístup k účtom.

## Vlastné pravidlá a nastavenia

Denný trail: predvolene povolený iba úzky pracovný zápis podľa návodu; používateľ ho môže výslovne vypnúť. Ďalšie preferencie: Zatiaľ nedoplnené. Custom rozšírenia sú vo frontmatter tejto Mapy a nesmú meniť základné polia či bezpečnostné brány.

## Prehľad oblastí a postupov

- [[Pracovná tabuľa.md|Pracovná tabuľa]]
- [[Začnite tu.md|Začnite tu]]
- [[O mne.md|O mne]]
- [[Prehľad firmy.md|Prehľad firmy]]
- [[Práca/Firma/Nástroje.md|Práca/Firma/Nástroje]]
- [[AI OS/Tím/index.md|AI OS/Tím/index]]
- [[AI OS/Postupy/pracovna-tabula.md|AI OS/Postupy/pracovna-tabula]]
- [[AI OS/Postupy/ukladanie-a-deduplikacia.md|AI OS/Postupy/ukladanie-a-deduplikacia]]
- [[AI OS/Postupy/inbox-a-napady.md|AI OS/Postupy/inbox-a-napady]]
- [[AI OS/Postupy/denny-trail.md|AI OS/Postupy/denny-trail]]
- [[AI OS/Postupy/kontrola-vysledku.md|AI OS/Postupy/kontrola-vysledku]]
- [[AI OS/Systém/Návody/Metadáta.md|AI OS/Systém/Návody/Metadáta]]
- [[Inbox/README.md|Inbox/README]]
- [[Atlas/Nápady/index.md|Atlas/Nápady/index]]
- [[Atlas/Rozcestníky/index.md|Atlas/Rozcestníky/index]]
- [[Kalendár/Denné zápisky/index.md|Kalendár/Denné zápisky/index]]
- [[Práca/Klienti/index.md|Práca/Klienti/index]]
- [[Práca/Príležitosti/index.md|Práca/Príležitosti/index]]
- [[Znalostná báza/Zdroje/index.md|Znalostná báza/Zdroje/index]]
- [[Znalostná báza/Spracované poznatky/index.md|Znalostná báza/Spracované poznatky/index]]
- [[Znalostná báza/Spracované poznatky/log.md|Znalostná báza/Spracované poznatky/log]]
- [[Ukážky/README.md|Ukážky/README]]
- [[Znalostná báza/Pravidlá.md|Znalostná báza/Pravidlá]]
- [[Procesy/system-nastavenie-firmy/model.yaml|Procesy/system-nastavenie-firmy/model.yaml]]

Atlas je priestor vybraných všeobecných vedomostí/nápadov. Práca drží firmu, klientov a príležitosti. Inbox je vstup, znalostná báza zdroje/syntézy. AI OS drží pravidlá, schému a budúci tím. Nepoužívaj všetky tieto indexy ako paralelné task managery. Model setupu je jediný zdroj počiatočných ôsmich ID/otázok; živé odpovede/stav nie sú v modeli.

## Ukladanie a hranice

Každý nový pracovný dokument má metadata, kontextové odkazy a vstup v príslušnom indexe. Bežné zápisy sú fresh patch/append s readbackom, originály sa neprepisujú. Synchronizácia vyžaduje lokálnu dostupnosť a pri prechode zariadenia potvrdenie dokončenia v UI poskytovateľa. Hash nie je dôkaz cloudovej aktuálnosti. Pri neznámej aktuálnosti dotknutý dokument iba čítaj.

## Umiestnenie a zálohovanie

Začať môžeš lokálne. Existujúci cloudový priečinok je dobrovoľná voľba, neznamená overenú zálohu. Zvolená cesta a používateľský dôkaz dostupnosti patria lokálnemu inštalačnému záznamu; všeobecné pravidlá sú v [[AI OS/Systém/Návody/Synchronizácia a zálohovanie.md|AI OS/Systém/Návody/Synchronizácia a zálohovanie]]. Otvorená úloha je iba na Pracovnej tabuli.
