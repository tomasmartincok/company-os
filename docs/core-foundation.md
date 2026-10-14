# Prvý funkčný celok inštalátora

Implementácia podľa [špecifikácie v1.7](specifikacia.md), schválená 14.10.2026. Označenie balíka: `0.1.0-core.1`, rozsah `foundation`. Tento celok vytvorí súborový základ, overí jeho stav a zachová úpravy pri opakovaní. Celý workshopový systém sa dokončí v ďalšej etape.

## Rozsah

- R1: clipboard test meria vložený text a raw bajty; doložená Windows LF→CRLF zmena má presnú inverziu a oddelený výsledok. Release/súborové hashe sa nemenia.
- R2: Unicode hranica tokenu ERP; Čerpáme, Čerpám, vyčerpá prechádzajú.
- R3: demo opravy v zadanie.md, B načíta konkrétne súbory; tabuľa/denný zápis nesú iba označený odkaz.
- R4: izolovaná maintainer Git fixture sa bez Gitu označí SKIP; build/inštalácia Git nepotrebujú.
- Jeden model firemného nastavenia → deterministická počiatočná tabuľa s ôsmimi ID a otázkami.
- Slovenské profily, Začnite tu, mapa/routing, pravidlá zápisov/linkov, AGENTS a tenký CLAUDE import.
- Fresh apply do nového/prázdneho koreňa, installed manifest, verify a rovnaká verzia bez resetu personalizácie.
- Deterministický release archív/manifest a pokyn Fázy 0 s pinmi; integrita a bezpečné cesty pred extrakciou/vykonaním.
- Node runtime sa podľa potreby pripraví lokálne z oficiálneho podpísaného zdroja. Globálne konfigurácie sa nemenia.

## Kontrolné body

- [x] R1–R4: source testy s kanonikou, izolovaný beh bez Gitu, zachované pôvodné bloky.
- [x] Core: čistý apply/verify, dva korene, uložená personalizácia a rovnaký setup bez zmien.
- [x] Negatívne prípady: cudzí obsah, symlink, poškodený model/ID, nesprávny pin/hash a nebezpečný archív.
- [x] Zostavenie deterministické, všetky prenesené hashe a odkazy platné.
- [x] macOS natívna Fáza 0, izolovaný runtime fallback a fresh-chat pokračovanie.
- [ ] Nezávislá kontrola výsledku a jazykové review verejných pokynov.
- [ ] GitHub zdroje + vývojový prerelease, úplný remote readback, checkpoint v Second Braine.

Výsledky a presné prostredie sa doplnia po vykonaní. Skutočný Windows/Claude Code/cloud sync/Obsidian/začiatočnícky pilot sa týmto checklistom nepredstiera. Plný update/recovery medzi zariadeniami, Oliver, ďalšie dva procesy, procesný HTML manuál/generátor a integrácia účastníckeho modulu zostávajú ďalšou etapou; prvý balík neobsahuje nefunkčné odkazy na tieto budúce časti. Otvorená licencia startera sa nevydáva za rozhodnutú; oficiálny runtime má vlastný LICENSE.


## Overenie kandidáta — 14.10.2026

macOS 27.0.1 arm64. Presný oficiálny runtime Node 24.16.0 overený podľa podpísaného SHASUMS (releaser fingerprint `5BE8A3F6C8A5C01D106C0AD820B1A390B168D356`); pôvod a štyri piny v [runtime evidencii](../content/runtime/node-24.16.0.json). Skutočný HTTPS download, natívne overenie, výber iba node+LICENSE a spustenie24.16.0 PASS. Runtime sa nebundluje a nevykonáva globálnu inštaláciu.

- Kompletná source suite pôvodne41/41 PASS bez SKIP; po doplnení CLI runtime guardu42 testov (17 core + 11 release + 14 workshop). Záverečná cielená release kontrola na pinovanom runtime prešla; zdrojové testy sú oddelené od Windows runtime. Core 17/17 samostatne prešiel aj na Node 26.5.0. Bez Gitu bez privátnej kanoniky modul 12 PASS / 0 FAIL / 2 SKIP; s kanonikou 13/0/1. Pôvodných 7 promptov/6 raw blokov/provenance byte-identických s 898dc6f, public/internal §1–17 zachované.
- Nový workspace má 28 súborov + installed manifest. Dva korene majú identickú tabuľu s 8 setup ID a rôzne workspaceID. Verify kontroluje skutočné bajty, ownership, metadata, model, ID a existujúce wiki ciele. Začnite tu je seeded; package/generated zmena má konflikt, personalizácia sa nereparuje ani neresetuje.
- Natívna Mac Fáza0 úspešne overila lokálnu fixture, extrahované súbory a bundle apply. Nesprávny pin/hash, repinned traversal/symlink a case/prefix/rezervované názvy majú zastavenie. Cudzí cieľ, symlinky, neplatné/duplicitné/chýbajúce ID a staged/promotion zlyhanie zachovávajú pôvodný obsah.
- Reálny Codex CLI 0.144.1, ChatGPT autentifikácia, ephemeral/config-isolated workspace-write: agent zo súborov doplnil fiktívny profil firmy, uzavrel iba 3 zodpovedané otázky, vytvoril platné user-UUID, denný trail a index. Osobný profil aj nezodpovedané otázky zachované. Externý verify PASS, rovnaké apply 0 writes a všetkých 30 bajtových hashov nezmenených. Druhý nový read-only chat bez histórie správne načítal fakty, otvorené otázky, jediný ďalší krok aj hranice foundation; 0 zmien. Nie je to desktopUI/Claude/Windows pilot ani dôkaz natívneho Oliverovho volania.
- Nezávislá kontrola zachytila tri chyby: slug ID mimo modelu, package ownership Začnite tu a case kolíziu archívu. Opravy a regresie PASS. Reálny chat odhalil nejasnú wiki inštrukciu; spresnená všetkým odkazom, nový čistý test vyššie PASS. Predošlé disposable prototypy nie sú dôkazom finálneho balíka.

Release builder CLI musí používať presneNode 24.16.0: novšia zlib komprimuje odlišné bajty. Rovnaké vstupy na pinovanom runtime vytvoria identické 3 assety, CLI na 26.5.0 odmietne výkon pred zápisom. Použi presnú cestu overeného runtime a `scripts/release/build-release.mjs --commit <40hex> --out <novy-absolutny-priecinok>`. Zostavený archív má 8 explicitne povolených vstupov; osobný checkout AGENTS, tests, outputs, lektorské podklady a audit prompt doň nepatria. Foundation neobsahuje tretie strany Mermaid/YAML/Markdown; ich licencie sa vyriešia pri ďalšej etape.

## Ďalší celok

Oliverov profil/workflowy a adaptéry, zostávajúce dva modely, generátor/manuál, následná integrácia Workshop a recompute komponentových hashov. Potom celý Mac/Windows/Claude/Obsidian/sync/začiatočnícky pilot a konkrétne update/recovery prípady podľa v1.7. Vedený firemný základ možno začať už na tomto foundation.
