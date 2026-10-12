---
type: specification
status: draft
version: "1.2"
created: 2026-10-12
updated: 2026-10-12
ai-generated: true
---

# company-os — kompletná špecifikácia v1.2

[Prehľad repozitára](../README.md)

**Autorita:** úplné konsolidované zadanie v1.2, aktualizované po Claude read-only review a potvrdení autora 12.10.2026. Povinné jadro zostáva; revízia uzatvára vybrané technické voľby a spresňuje testy. Stav draft znamená zadanie na review pred implementáciou, nie vydaný inštalátor.

**Aktuálna fáza:** publikácia špecifikácie. Inštalátor/závislosti sa v tejto fáze nevytvárajú. Registrácie, ceny a workshopový web sú mimo zadania.

**Repozitár:** [tomasmartincok/company-os](https://github.com/tomasmartincok/company-os), clone URL `https://github.com/tomasmartincok/company-os.git`.

## 1. Výsledok pre účastníka a rozsah

company-os je prenosný súborový pracovný systém firmy používaný cez lokálneho AI agenta a voliteľne Obsidian. Účastník vloží GitHub odkaz a pripravený pokyn do chatu, vyberie pracovný priečinok a cez vedený rozhovor získa vlastný kontext, prispôsobeného Olivera, pracovnú tabuľu, prvého odborného AI zamestnanca a jeho proces.

Workshopový cieľ: človek vie zadať vlastnú úlohu, posúdiť výsledok, nájsť uložený výstup a zopakovať postup v novej konverzácii. Aktuálny rámec workshopu je približne šesť hodín, najviac osem účastníkov, workshop-first. Špecifikácia nesľubuje nový termín, miesto, cenu ani obchodný model.

### Povinné vo v1

- Slovenská, vysvetlená štruktúra Second Brainu a pravidlá zapisovania.
- Inštalácia a následné nastavenie vedené chatom; účastník nezadáva terminálové príkazy.
- Jeden preddefinovaný **Oliver — všeobecný stratég, pravá ruka a sprievodca systémom**, prispôsobiteľný účastníkom.
- AI tím: tvorba ďalších zamestnancov z vedeného rozhovoru, spoločné pravidlá a ľudský prehľad rolí.
- **Procesný generátor:** jeden model → návod pre človeka, strojovo čitateľný podklad pre agenta, Mermaid a HTML manuál.
- Jedna pracovná tabuľa s onboardingom, úlohami a pokračovaním medzi chatmi/modelmi.
- Znalostná báza podľa LLM Wiki patternu: nemenné zdroje, odvodené poznatky, index a história zmien.
- Denné zápisky: samostatný súbor pre každý deň, viac session ako ďalšie bloky.
- Inventár nástrojov a zdrojov pravdy, oddelený od skutočných integrácií a oprávnení.
- Codex a Claude Code; macOS a Windows; zvolený lokálny alebo synchronizovaný priečinok.
- Čistý ukážkový proces a dva fiktívne vstupy, aby sa manuál dal otvoriť hneď po inštalácii.
- Bezpečné opakovanie setupu, zachovanie personalizácie a dát, verzia a overiteľný stav inštalácie.

### Voliteľné ukážky

Zjednodušený Blog Writer a vzor spracovania stretnutia. Obsah môže byť pribalený ako ukážka; ich aktivácia nesmie byť podmienkou dokončenia základného onboardingu. Voliteľná schopnosť má vlastné deklarované závislosti.

### Mimo v1

Vlastná SaaS aplikácia, celý pôvodný interný tím a manuál, ERP/CRM integrácie, automatické rutiny, externé indexovanie histórie session, autonómne publikovanie/odosielanie, klientské účty, prístupy a súkromné osobné profily. Oliver zostáva jediným prispôsobiteľným úvodným asistentom.

## 2. Princípy a autorita údajov

1. Súbory sú prenosný zdroj pracovného kontextu. AI klient možno vymeniť bez straty dokumentov a rozpracovanej práce.
2. Jedno pravidlo, údaj alebo pracovný stav má jednu kanoniku; ostatné pohľady odkazujú alebo sa generujú.
3. Účel a subjekt určujú miesto výstupu. Klientský podklad aj jeho výstup zostávajú pri príslušnom klientovi/projekte.
4. Štruktúra obsahuje zrozumiteľný základ; konkrétne projektové vetvy vznikajú podľa skutočného obsahu.
5. Človek potvrdzuje firemné fakty, strategické rozhodnutia, právomoci a význam procesu. AI návrh je označený ako návrh.
6. Existujúca autorizácia platí vo svojom rozsahu; bežné pokračovanie nevyžaduje stále nové OK. Nové externé, finančné, produkčné zásahy a zmena prístupov majú konkrétnu bránu.
7. Výstup procesu a potvrdený výsledok jeho vykonania sú odlíšené. Prítomná mapa nedokazuje funkčné nástroje ani vykonanie práce.
8. Pracovný priestor účastníka je súkromný. GitHub distribuuje balík, nie obsah jeho firmy. Lokálne súbory neznamenajú lokálne spracovanie modelom; návod vysvetlí, aké údaje používa zvolený AI poskytovateľ.

| Údaj | Kanonika vo v1 |
|---|---|
| Používateľ, komunikácia a pracovné preferencie | `O mne.md` |
| Potvrdené firemné fakty a rozhodnutia | `Prehľad firmy.md` |
| Základné agentové pravidlá a načítanie kontextu | `AGENTS.md`; `CLAUDE.md` je iba import |
| Ukladanie, názvy, metadáta a odkazy | `Mapa systému.md` |
| Vlastné pravidlá a nastavenia používateľa vrátane denného trailu | `Mapa systému.md`, sekcia Vlastné pravidlá a nastavenia |
| Inventár nástrojov a dôkazy pripojenia | `Práca/Firma/Nástroje.md` |
| Definícia piatich etáp a dôkazy ich dokončenia | `AI OS/Postupy/onboarding.md` |
| Index tímu a routing | Generovaný `AI OS/Tím/index.md` z kanonických profilov |
| Onboardingové checkboxy, stav úloh, vlastník a jediný aktuálny ďalší krok | `Pracovná tabuľa.md` |
| Zadanie, odpovede a otvorené otázky konkrétnej úlohy | Jej pracovný dokument pri príslušnom subjekte |
| Definícia zamestnanca | Jeho jeden kanonický profil `SKILL.md` |
| Potvrdený proces | Jeho `model.yaml` |
| Pôvodné podklady | Originál pri subjekte alebo v `Znalostná báza/Zdroje/` |
| Odvodené poznatky | `Znalostná báza/Spracované poznatky/` so zdrojmi |
| História práce | Dátovaný denný súbor |
| Verzia a vlastnenie inštalovaných súborov | Technická evidencia `.os-starter/` |

Používateľ môže už mať CRM/task manager. Onboarding to zistí. Živý externý stav sa nepreberá automaticky do druhej nezávislej evidencie; pre takú firmu sa na tabuľu uložia odkazy a dátované projekcie. Pripojenie nie je súčasťou v1. Bez externého systému je lokálna tabuľa autoritou lokálnych úloh. 

## 3. Štruktúra vytvoreného pracovného priestoru

```text
<Názov firmy> OS/
├── Začnite tu.md
├── AGENTS.md
├── CLAUDE.md                 # iba import @AGENTS.md
├── Prehľad firmy.md
├── O mne.md
├── Mapa systému.md
├── Pracovná tabuľa.md
├── Inbox/
│   └── README.md
├── Atlas/
│   ├── Nápady/
│   └── Rozcestníky/
├── Kalendár/
│   └── Denné zápisky/
├── Práca/
│   ├── Firma/
│   │   └── Nástroje.md
│   ├── Klienti/
│   └── Príležitosti/
├── Znalostná báza/
│   ├── Pravidlá.md
│   ├── Zdroje/
│   └── Spracované poznatky/
│       ├── index.md
│       └── log.md
├── AI OS/
│   ├── Tím/
│   │   ├── index.md          # generovaný index a routing
│   │   └── oliver/SKILL.md
│   ├── Postupy/
│   │   └── onboarding.md    # kanonická definícia piatich etáp
│   └── Systém/
│       ├── Návody/
│       ├── Šablóny/
│       └── Generátor/
├── Procesy/
│   └── <stabilné-id>/
│       ├── Príprava.md
│       ├── model.yaml
│       ├── postup.md
│       └── postup.mmd
├── Manuál/
│   ├── index.html
│   ├── tím.html
│   └── assets/
├── Ukážky/
├── .agents/skills/
├── .codex/agents/
├── .claude/skills/
├── .claude/agents/
└── .os-starter/
```

Strom je cieľová šablóna, nie tvrdenie o existujúcej implementácii. Vlastný procesový adresár vzniká pri skutočnom zadaní; potvrdený model až po obsahovom rozhodnutí. Ukážkový proces je jasne označený a oddelený od vlastných procesov. Index s nulou vlastných procesov/zamestnancov musí byť platný.

Viditeľné názvy sú slovenské a popisné. `Atlas`, `Inbox` a `AI OS` majú vysvetlenie účelu. Povinné platformové názvy `AGENTS.md`, `SKILL.md`, `.agents`, `.codex`, `.claude` zostávajú zachované. Technické ID a názvy adaptérov sú stabilné, krátke a bez diakritiky; ľudské mená môžu mať diakritiku.

**Default v1.2:** balík obsahuje jednoriadkový `CLAUDE.md` s `@AGENTS.md`. Je to technický import, neobsahuje druhú kópiu pravidiel. Priame čítanie AGENTS v Claude závisí od verzie/režimu a prítomnosti nadradených CLAUDE súborov; import je zvolená kompatibilná cesta. Preflight vypíše relevantné projektové/nadradené/globálne pokyny a konflikty vrátane Codex override súborov. Cudzí config nemení. Import nezaručuje izoláciu od nadradených pravidiel ani prekonanie managed režimu; skutočné načítanie musí potvrdiť nová session. [Claude — Memory](https://code.claude.com/docs/en/memory#agentsmd)

## 4. Obsah základných dokumentov

| Súbor | Požadovaný obsah |
|---|---|
| `Začnite tu.md` | Jednostránkový vstup: účel systému, účet/klient, otvorenie koreňa a offline dostupnosť, očakávané UI schválenia, vyvolanie Olivera, odkaz na kanonický onboarding a tabuľu, príklady zadaní, manuál a recovery. Nekopíruje celý checklist ani pravidlá etáp. |
| `AGENTS.md` | Balíkom udržiavaný agentový vstup: poradie načítania, pointery, routing, autorizácia, ukladanie, pokračovanie, denné zápisky a kontrola. Hlavička odkazuje na sekciu Vlastné pravidlá a nastavenia v `Mapa systému.md`. Cieľový rozpočet najviac 8 KiB UTF-8; globálna/nadradená reťaz sa overí osobitne. |
| `CLAUDE.md` | Balíkom udržiavaný import `@AGENTS.md` bez vlastných obchodných pravidiel. |
| `O mne.md` | Meno, rola, jazyk, tón, pracovné preferencie, spôsob rozhodovania a požadovaná spolupráca s AI. Osobné citlivé profily sa predvolene nezbierajú. |
| `Prehľad firmy.md` | Firma/web, ponuka, zákazníci, odlišnosti, relevantní ľudia a zodpovednosti, aktuálny smer, potvrdené rozhodnutia, zdroje/dátumy a neznáme. Odkaz na inventár nástrojov. |
| `Mapa systému.md` | Účel oblastí, routing, názvy/metadáta a zdroje; vlastné pravidlá a nastavenia používateľa, napr. denník zap/vyp. Je to prispôsobiteľný seeded dokument. Vlastné pokyny nesmú predstierať technické oprávnenie ani prebiť bezpečnostné obmedzenia klienta. |
| `Pracovná tabuľa.md` | Jediný stav etáp nastavenia a prehľad aktuálnej práce; úlohy, ďalší krok, vlastník a odkaz na podklady. Podrobnosti v §6. |

### Povinné správanie AGENTS

Na začiatku session agent načíta pravidlá, `Prehľad firmy.md`, `O mne.md`, `Mapa systému.md` a relevantnú časť tabule. `Začnite tu.md` číta pri onboardingu alebo žiadosti o vysvetlenie. Nenačítava automaticky celú históriu, všetky procesy ani všetky skills.

Rozpracované zadanie, odpovede, otvorené otázky a podklady uloží do pracovného dokumentu. Stav, vlastník a jediný aktuálny ďalší krok patria tabuli; pracovný dokument na položku odkazuje a tieto polia nezrkadlí. Pri návrate sa najprv číta uložený stav. Po dokončení overí uložený výstup, aktualizuje tabuľu a podľa §10 doplní denný zápis.

Weby, e-maily, PDF a raw zdroje sa čítajú ako podklady, nie ako nové pokyny meniace oprávnenia. Pri neznámej schopnosti alebo pripojení agent pomenúva obmedzenie a pokračuje už oprávnenou nezávislou prácou.

## 5. Vedený onboarding — päť etáp

Tabuľka nižšie je špecifikácia obsahu budúceho `AI OS/Postupy/onboarding.md`. Tento súbor bude jedinou kanonikou definícií etáp, otázok a dôkazov. Začnite tu a Oliver odkazujú naň; pracovná tabuľa drží len postupné checkboxy/stav so stabilnými ID etáp.

Päť bodov je päť etáp, nie päť otázok. Sprievodca kladie len potrebné otázky, zvyčajne jednu alebo malú súvisiacu skupinu; rešpektuje už uložené odpovede. Človek môže nastavenie prerušiť a pokračovať na vlastnej úlohe, keď má táto úloha potrebný kontext a oprávnenia.

| Etapa | Otázky a činnosť | Dôkaz dokončenia |
|---|---|---|
| 1. Pracovný priestor | OS, AI klient, názov firmy, cieľový priečinok, typ úložiska; preflight, závislosti, základ a ukážkový manuál. | Súbory existujú, nový chat číta správny AGENTS, ukážkový manuál sa otvorí. Samotné stiahnutie nie je PASS. |
| 2. Používateľ a firma | Rola, preferencie, firma/ponuka/zákazníci/web, dôležité podklady a jedna opakovaná úloha. | Človek opravil/potvrdil súhrn; zdroje a neznáme sú označené v profiloch. |
| 3. Oliver, nástroje a hranice | Meno/štýl/kompetencie Olivera, používané systémy a zdroje, vlastník údajov, oprávnenia a kontrola. | Profil a inventár uložené; reálne vyvolanie overené; existujúci nástroj je odlíšený od funkčného pripojenia. |
| 4. Vlastný zamestnanec a proces | Výsledok, podklady, kroky, vetvy, zodpovednosti, kontrola a miesto výstupu. | Profil + proces potvrdené; model validný; návod/mapa/prehľad odkazujú na rovnaký proces a vlastníkov. |
| 5. Samostatná práca | Prvý vstup → kontrola/opravný krok → druhý vstup v novej konverzácii. | Používateľ vie zadať, skontrolovať a nájsť výstup. Tabuľa a denný zápis zodpovedajú výsledku. |

Stav checkboxov je iba na pracovnej tabuli. Agent ich označuje na základe konkrétneho dôkazu; nedokončený bod má dôvod a ďalší krok. Pri novej session nezopakovať hotové etapy; stručne navrhnúť pokračovanie pri nehotovom bode. Po dokončení sa onboarding nevnucuje pri každej pracovnej úlohe.

### Web a firemný profil

Účastník môže poskytnúť URL alebo dokumenty. Agent vyberie základné verejné údaje, uvedie URL/dátum a predloží súhrn na opravu. Vlastníkov, interné procesy, oprávnenia ani strategické ciele nedodáva bez potvrdenia. Keď browse nie je dostupné, pokračuje s používateľovým opisom; závislosť na prehliadaní nie je povinná.

### Inventár nástrojov

`Práca/Firma/Nástroje.md`: názov, účel, vlastník, autoritatívne údaje, miesto dát, spôsob práce, bezpečná referencia na prístup a stav `používaný / pripojený a overený / pripraviť neskôr`. Pri overenom prístupe uložiť dátum a rozsah read-only skúšky. Heslá, tokeny, recovery kódy a privátne kľúče zostávajú mimo poznámok. Neexistujúca integrácia nesmie byť označená ako pripravená.

## 6. Pracovná tabuľa a trvalé pokračovanie

Tabuľa je čitateľný Markdown dashboard v Obsidiane aj bez pluginov. Sekcie: **Nastavenie systému / Teraz / Čakáme na / Neskôr / Dokončené**. Množstvo prioritnej práce si určuje firma; balík nevkladá priority pôvodnej firmy ani pevné obchodné limity.

Úloha má krátky výsledok, voliteľné stabilné ID, vlastníka, ďalší konkrétny krok a odkaz na pracovný dokument. Termín iba keď je skutočne dohodnutý. Stav, vlastník a jediný aktuálny ďalší krok sa evidujú na tabuli; detailný dokument uchová zadanie, fakty, odpovede, otvorené otázky, podklady, dôkazy a schválenia. Detailné otázky sa nekopírujú na tabuľu.

```markdown
# Pracovná tabuľa

## Nastavenie systému
- [x] Pracovný priečinok a manuál fungujú
- [ ] Potvrdiť profil používateľa a firmy
- [ ] Prispôsobiť Olivera, nástroje a hranice
- [ ] Vytvoriť vlastného zamestnanca a proces
- [ ] Overiť prácu na dvoch vstupoch

## Teraz
- [ ] Dokončiť proces klientských požiadaviek
  - Vlastník: používateľ + Oliver.
  - Ďalší krok: určiť schvaľovateľa odpovede.
  - Podklady: [[Procesy/klientske-poziadavky/Príprava]]

## Čakáme na
- [ ] Doplniť vzorový vstup od používateľa

## Neskôr
- [ ] Pripraviť vlastný postup tvorby článku

## Dokončené
```

Názvy piatich onboardingových bodov vo vzore sú krátky pohľad na kanonický postup, nie druhá definícia pravidiel. Príklad nie je pripravenou úlohou reálnej firmy. Konkrétny vstup sa pri založení deduplikuje podľa existujúcich súborov/ID. Človekom upravené checkboxy a komentáre agent pri ďalšom čítaní rešpektuje; neprepisuje ich starším stavom z chatu.

Pri „chcem popísať proces“ Oliver vyhľadá existujúcu prípravu, uloží cieľ a otázky, pridá odkaz s najbližším krokom, dopĺňa potvrdené odpovede a po potvrdení pripraví model. Pri prerušení zostane všetko potrebné na pokračovanie. Pri dokončení zaznamená dôkaz výsledku a históriu do denného zápisu; ukončená príprava ďalej nevedie konkurenčný normatívny postup popri modeli.

## 7. Oliver a tvorba AI tímu

### Predvolený Oliver

Všeobecný stratég, pravá ruka a sprievodca firemným systémom. Pri inštalácii funguje s neutrálnym profilom; človek na workshope prispôsobí meno, spoluprácu, kompetencie a firemný kontext. Oliver je inline skill v hlavnom rozhovore, bez `context: fork` a bez predvoleného adaptéra subagenta; zachováva dialóg používateľa. Ohraničené úlohy možno delegovať dostupným odborným rolám. Samostatný druhý úvodný asistent sa nevytvára.

Oliver vie vysvetliť systém a manuál, pomôcť s prioritami, viesť onboarding, tvorbu zamestnancov/procesov/znalostnej bázy, ukladať pracovný stav a koordinovať primeranú kontrolu. Nevymýšľa právomoci; cenu, záväzok, externé odoslanie a produkciu rieši podľa potvrdených hraníc. Riadi sa zdrojmi v §2 a vlastnými postupmi, nie súkromným kontextom autora, osobným profilom či klientskymi výnimkami.

### Jeden kanonický profil

Profil v `AI OS/Tím/<id>/SKILL.md` je jediná editovateľná definícia zamestnanca. `name` = stabilné ID = názov priečinka; v tomto balíku je ID 1–64 znakov z `[a-z0-9-]`, nesmie začínať ani končiť pomlčkou, ani obsahovať dve pomlčky za sebou. ASCII je naša voľba prenosnosti; Agent Skills štandard povoľuje aj Unicode lowercase alfanumerické znaky. `description` má 1–1024 znakov, obsahuje účel/triggery; ľudský alias sa do generovaného description adaptéra odvodí z `metadata.display_name`, s dodržaním limitu.

V `metadata` sú stringové položky `display_name`, `role`, `delegation` (`disabled` alebo `allowed`) a `access_mode` (`read-only` alebo `read-write`); nástroje, výsledky, zdroje, hranice, kontrola a procesové odkazy sú v tele profilu. Presné doplňujúce polia validátor uzavrie pred implementáciou, údaje sa neupravujú vo viacerých registroch. Oliver má ID `oliver` a `delegation: disabled` pre svoj vlastný natívny subagent adapter; tým sa nevypína jeho koordinácia odborných úloh. [Agent Skills specification](https://agentskills.io/specification)

Z profilu sa odvodia routing/discovery údaje, tenké natívne adaptéry a ľudský prehľad tímu. Osobný názov/alias a funkčné ID sú odlíšené; proces odkazuje na stabilné ID, aby premenovanie AI zamestnanca nerozbilo väzby. Zmena profilu obnoví index/routing `AI OS/Tím/index.md`, dotknuté adaptéry a HTML. UI meno v `agents/openai.yaml` je odvodené z `metadata.display_name`; technické vyvolanie ostáva podľa ID. Návod vysvetlí, že zmena aliasu nemení `/oliver` alebo `$oliver`; prirodzené oslovenie používa alias cez index. Generované súbory sa ručne neupravujú.

### Vedený rozhovor pre odborného zamestnanca

1. Ako sa volá a akú funkciu vykonáva?
2. Aký konkrétny výsledok má doručiť a kedy sa použije?
3. Ktoré zdroje smie používať a ktoré údaje sú autoritatívne?
4. Aké nástroje má dostupné a overené?
5. Aké kroky, rozhodnutia a chyby má zvládnuť?
6. Čo smie urobiť, kde sa zastaví a kto schvaľuje?
7. Kto kontroluje výsledok a kam ho uloží?
8. Na ktorých dvoch vstupoch jeho prácu overíme?

Profil a proces prevezmú potvrdené odpovede. Všetky príslušné oprávnenia sú popísané, nie automaticky udelené vytvorením zamestnanca. Subagenti sa používajú podľa potreby a dostupnosti; počet rolí neznamená trvalý paralelný beh ani bezplatnú kapacitu. Sériové vykonanie rovnakého postupu musí zostať možné.

## 8. Procesný generátor a manuál

Toto je povinná diferenciačná schopnosť v1. Reuse existujúceho `process-manual` engine/reader je preferovaný, ale jeho obal pôvodnej firmy sa musí generalizovať.

### Jeden model, viac pohľadov

Procesový model `model.yaml` má stabilné ID, názov, verziu/dátum, účel/spúšťač, ľudského vlastníka, zúčastnené role, vstupy, výsledok, zdroje, pravidlá/hranice, kroky, rozhodovacie vetvy, kontrolu, chyby/recovery a dôkazy. Agent číta štruktúru a príslušné skills; samotný diagram nie je deterministický vykonávač.

Generátor z modelu vytvorí `postup.md`, `postup.mmd` a HTML text/mapu. Manuál zobrazí prehľad procesov, prehľad tímu a vzájomné odkazy. Obsah textu a mapy musí sedieť; úprava sa vykonáva v modeli, potom build/check.

### Požadované generalizácie

- Konfigurácia názvu firmy/vaultu, autora a relatívnych koreňov; odstránenie mien, ciest, značky a procesových výnimiek pôvodnej firmy.
- Prehľad odvodený z modelov; prázdna nová firma je platná, bez povinného konkrétneho firemného Markdown registra.
- Role/vlastníci podľa stabilných ID z kanonických profilov; žiadne regex rozhodovanie podľa osobného mena zamestnanca.
- Validácia jedinečných ID, známych vlastníkov, cieľov vetiev, dosiahnuteľnosti a koncových výsledkov pred zápisom výstupov.
- Bez vykonávania kódu z modelov; bezpečné vykreslenie externého obsahu a kontrola cieľových ciest vrátane Windows a symlinkov.
- Manifest generovaných súborov, ochrana cudzieho obsahu a obnova pri chybe. Zastaralý výstup možno odstrániť len ako preukázateľne vlastnený.

Mermaid, YAML parser a Markdown renderer sú lokálne pribalené, s verziami, licenciami a kontrolnými súčtami. Reader je určený na otvorenie z `file://` bez servera/internetu: klasické skripty (napr. IIFE/UMD), žiadny povinný ES module import ani `fetch`; dáta sú bezpečne vložené pri builde a text predvykreslený. Text je dostupný aj bez JS, mapa pri zapnutom JS. Vložené dáta/HTML sa escapujú a externý obsah sa nesmie zmeniť na vykonateľný skript. Toto je návrhový kontrakt; Chrome, Edge a Safari offline sú budúci runtime test. Prenáša sa celý manuál s assets.

Procesný renderer vytvára ľudský prehľad; natívne Codex/Claude definície musí vytvoriť generátor adaptérov z rovnakých profilov. Prvý test musí overiť práve ich spoločnú kanoniku, nielen HTML.

## 9. Znalostná báza, spracovanie podkladov a klienti

Používateľský názov je **Znalostná báza**; návod vysvetlí vzťah k LLM Wiki. `Atlas` drží človekom vybrané poznámky, znalostná báza odvodené syntézy a súvislosti. Wiki súhrn nemení potvrdené rozhodnutie alebo živý stav práce.

- `Zdroje/`: originály alebo bezpečné referencie, read-only pre obsahové úpravy; nová verzia zachová pôvodnú. Import/kópia je vedomý krok v povolenom rozsahu.
- `Spracované poznatky/`: agentom udržiavané poznámky s `sources`, dátumom, súvislosťami a mierou istoty; `index.md` je katalóg a `log.md` appendová história úspešných zmien.
- **INGEST:** načítať zdroj → navrhnúť alebo vykonať už povolenú syntézu → overiť → aktualizovať poznatok/index/log.
- **QUERY:** čítať index a relevantné stránky → odpoveď so zdrojmi a neistotou. Samotná otázka predvolene nevytvára novú poznámku ani logovací zápis.
- **LINT:** read-only kontrola zdrojov, odkazov, duplicít/aktuálnosti → návrh → opravy v potvrdenom rozsahu.

`ingest inbox` triedi Inbox; `wiki ingest` alebo „pridaj zdroj do znalostnej bázy“ buduje poznatky. Oba smery majú zrozumiteľný návod a zachovajú originál. Chýbajúci zdroj alebo odpoveď sa označí.

Klient/projekt má jeden hlavný vstup, napr. `Práca/Klienti/<klient>/_klient.md`, s kontextom, zdrojmi, relevantným postupom a dátovanou históriou. Konkrétny projekt má vlastný vstup podľa potreby. Požiadavka, podklady a výsledky zostávajú pri tom istom subjekte; znalostná báza na ne odkazuje bez samoúčelnej druhej kópie. Pred založením preveriť aliasy a existujúci priečinok. Kód, runtime, veľké nahrávky a tajomstvá majú určené externé miesto s bezpečnou referenciou.

## 10. Denné zápisky a spätné vyhodnotenie

**Rozhodnutie pre v1:** jeden súbor na deň, `Kalendár/Denné zápisky/YYYY-MM-DD.md`. Viac session v rovnaký deň sa zapisuje ďalšími krátkymi blokmi. Jeden rastúci súbor pre všetky dni sa nepoužije.

Predvolená úzka autorizácia zapísať pracovný trail bude vysvetlená počas setupu: platí len pre denné pracovné zápisky; neudeľuje právo upravovať ostatné osobné poznámky/kalendár ani vytvárať externé udalosti. Nastavenie používateľa sa uloží do `Mapa systému.md`, sekcie Vlastné pravidlá a nastavenia; výslovné vypnutie sa rešpektuje.

Agent doplní zápis po dokončení logickej časti práce alebo pri potvrdenom rozhodnutí a okamžite pri „zapíš“, „končím“, „na dnes“. Pri čistej otázke bez vykonanej práce ani na prázdny deň nevytvára fiktívny výkon. Náhle zavretie klienta nie je garantovaný trigger; preto sa zapisuje priebežne pri výsledkoch.

Zápis: čomu sa práca venovala, výsledok a odkazy, potvrdené rozhodnutia, otvorené body/ďalší krok. Návrh sa neoznačí ako prijaté rozhodnutie. Zápis je heslovitý, bez raw chatu a tajomstiev; duplicita toho istého pracovného výsledku sa nedopíše pri retry. Readback overí správny deň v používateľovom časovom pásme a zachovanie starších blokov.

Týždenný/mesačný prehľad vzniká na požiadanie z vybraného obdobia so zdrojovými odkazmi. Odlišuje vykonanú prácu, čakanie a návrhy. Neaktivuje automatický rozvrh, learning loop alebo zmenu policy. Rozhodnutie patrí do firemného prehľadu, úloha na tabuľu, denný záznam uchová históriu a odkazy. Žiadne automatické odhady času/fakturácia z denníka vo v1.

## 11. Skills a pripravené ukážky

Povinné systémové schopnosti Olivera: vysvetlenie/obnovenie onboardingu, tvorba zamestnanca, tvorba/úprava procesu a obnovenie manuálu, pracovná tabuľa, bezpečné ukladanie a deduplikácia, nápady/Inbox, denné zápisky, znalostná báza a kontrola výsledku. Detailné postupy sú v `AI OS/Postupy/`; Oliverov profil na ne odkazuje.

Jednoduchá nezávislá kontrola porovná zadanie, zdroje a výsledok, s verdiktom PASS/PARTIAL/FAIL/UNKNOWN. Samostatný verifier môže byť voliteľnou rolou; ak je nutné nezávislé overenie, autor svojho výsledku sa nevydáva za nezávislého reviewera.

Pribalená ukážka spracovania zápisu zo stretnutia: fiktívny text → fakty/rozhodnutia/úlohy → ľudská kontrola → uložený výsledok. Funguje bez Gmailu, nahrávača alebo CRM; obsahuje dva vstupy. Ukážky sú označené a nedostanú sa medzi firemné potvrdené údaje.

Voliteľný Blog Writer prenesie jednoduché jadro používaného postupu: zdroje → osnova → potvrdenie → text → kontrola. Plný interný workflow s pevnými rolami pôvodnej firmy, CMS, médiami a automatickými follow-upmi sa neprenáša. Hlas firmy a zdroje sa doplnia; publikovanie nie je implicitnou časťou príkladu.

## 12. Metadáta, zápisy a technické adaptéry

`Mapa systému.md` vlastní základnú schému: typ, stav, subjekt/projekt, dátumy, vlastník, zdroj a AI pôvod/tag. **Properties dátumy sú ISO `YYYY-MM-DD`**, prípadný čas ISO s časovým pásmom; denný filename je `YYYY-MM-DD.md`. Ľudské zobrazenie môže byť lokalizované. Toto pravidlo patrí novému company-os, nemení schému pôvodného súkromného vaultu. [Obsidian — Properties](https://obsidian.md/help/properties)

Poznámka má relevantné prepojenia pod H1 na existujúce ciele; neznáme sú označené. Znalostná báza pridá zdroje/súvislosti/istotu, profil použije Agent Skills polia podľa §7, procesový YAML vlastnú validačnú schému. AI pôvod nie je schválenie. Presné typy a doplňujúce povinné polia sa uzavrú pred implementáciou.

### Zápisová vrstva a súbežná práca

Pred zápisom znovu načítať aktuálny súbor a porovnať presný byte hash s verziou načítanou pre návrh. Pri zmene nevykonať pripravený prepis; znovu vyhodnotiť aktuálny obsah a aplikovať len vlastný nekolidujúci blok, alebo ukázať konflikt na rozhodnutie. Pri významnom prepise zachovať obnoviteľnú zálohu, zapisovať cez dočasný súbor a atomickú náhradu podľa možností OS, potom readback. Krátka lokálna ochrana koordinuje našich vykonávateľov; nezaručuje spoluprácu externého editora.

Na začiatku session skontrolovať známe konfliktné kópie a stav lokálnej dostupnosti úložiska. Pri neistej synchronizácii zastaviť zápis do dotknutého objektu. Pred prechodom na druhé zariadenie počkať na dokončenie synchronizácie a znovu načítať stav. Jeden pracovný objekt má jedného aktívneho zapisovateľa; agenti zapisujú sekvenčne. Človek môže tabuľu upraviť v Obsidiane, agent jeho zmenu znovu načíta. **Lokálny hash nedokazuje aktuálnosť cloudu alebo iného zariadenia** a nevyrieši distribuovaný race. Nevyhlasovať univerzálnu bezkonfliktnosť bez konkrétnych testov poskytovateľa.

Originály a release/runtime archívy sa overujú SHA-256 z presných bajtov. Generované nové texty majú UTF-8/LF. Voliteľné porovnanie textu po LF/NFC normalizácii môže vysvetliť rozdiel; nesmie nahradiť bezpečnostný checksum, prepísať zdroj ani samo autorizovať update zmeneného súboru. Pri názvoch sa normalizácia používa na detekciu kolízií; existujúce názvy/obsah sa automaticky neprepisujú.

### Vyvolávanie a platformové cesty

| Povrch | Kontrakt v1.2 |
|---|---|
| Desktopový Codex | Cieľ je vybrať skill cez `@` s ľudským `display_name`, ak to workshopová verzia ponúka. Konkrétny selector zostáva UNKNOWN do UI testu. Existencia custom agent TOML tento UX dôkaz nedáva. |
| Codex CLI / IDE | Skill cez `$<id>` alebo `/skills`; discovery wrapper `.agents/skills/<id>/SKILL.md`. |
| Codex subagent | `.codex/agents/<id>.toml` len pre rolu, ktorá má `delegation: allowed`; explicitné ohraničené zadanie. Oliver default tento adaptér nemá. |
| Claude Code skill | `/oliver`, ďalšie `/id` cez `.claude/skills/<id>/SKILL.md`. `name` zostáva ID, ľudský alias v description/profile; menu/príkaz vysvetlí návod. Oliver inline bez forku. |
| Claude Code subagent | `.claude/agents/<id>.md` iba pre rolu s povoleným delegovaním. Fork skill je samostatný kontext bez histórie; vhodný iba pre úplné ohraničené zadanie. |
| Všetky podporované povrchy | Prirodzené oslovenie aliasom je fallback: načítať `AI OS/Tím/index.md`, zvoliť správny kanonický profil; pri nejasnom aliase vyžiadať spresnenie. |

Wrapper je krátky pointer na jeden profil/postup. SKILL odkazy majú explicitný základ v priečinku skillu; ich správne vyriešenie sa otestuje. Natívna agentová definícia nespolieha na to, že model pozná polohu TOML/Markdown configu: uvádza cestu od overeného workspace rootu. Koreň sa rozpozná podľa jedného markeru **`.os-starter/`** a manifestu; pri nejednoznačnosti sa nevymýšľa. Marker je kontrakt nášho systému, sám neprenastavuje discovery Codexu. Nevytvárať ďalší paralelný systémový marker.

Podporovaný predvolený štart session je koreň OS otvorený ako projekt. Codex bez nájdeného project rootu kontroluje iba aktuálny priečinok; skills discovery tiež závisí od povrchu/rootu. Štart z podpriečinka bez Gitu je osobitný test, nie automatický PASS. Pred overením ho návod vedie späť do koreňa. `project_root_markers` je možná budúca voľba po overení config vrstvy; globálne nastavenie sa automaticky nemení. [Codex — AGENTS](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Skills](https://learn.chatgpt.com/docs/build-skills)

Adaptéry sú bežné súbory bez povinných symlinkov, projektový scope je default. Discovery/generovanie adaptérov musí počítať s chránenými adresármi podľa §13 aj pri pridaní ďalšieho zamestnanca. Zmeny alebo prvé vytvorenie adresárov môžu vyžadovať novú session podľa klienta; verify to preverí. Interné workflowy sa nevystavujú ako ďalší zamestnanci. Model/reasoning sa dedí od používateľa, bez pevného model aliasu v starteri.

AGENTS cieľ najviac 8 KiB neznamená garantované miesto v globálnej reťazi. Preflight/verify preverí aktívne override/nadradené pokyny, reálny byte rozsah a úplnosť načítania. Codex default limit 32 KiB sa týka kombinovaných pokynov; nový chat musí preukázať správne načítanie, nie len citovať pripravený súbor.

## 13. Inštalátor, závislosti a životný cyklus

### Prerekvizity a krok 0 v UI

Používateľ má nainštalovaný podporovaný lokálny AI klient, funkčnú autentifikáciu, aktuálne oprávnenie používať daný produkt a dostupné limity. Pred workshopom preveriť aktuálny účet/plán/API cestu a prípadné náklady; bez dôkazu nesľubovať dostupnosť z bezplatného webového chatu. Heslá/tokeny sa do súborov nezapisujú. Presné podporované verzie a konto sa znovu overia pre účastníka.

Používateľ v UI vyberie alebo vytvorí cieľový priečinok a otvorí ho ako projekt; pri cloudovom priečinku nastaví lokálnu/offline dostupnosť. Návod ukáže potrebné kroky a typické systémové výzvy na prístup k priečinku. Keď agent dokáže priečinok bezpečne vytvoriť v už povolenom rozsahu, môže to vykonať; potvrdený root vždy zostáva známy obom. Terminálové príkazy píše/vykonáva agent, účastník sa ich nemusí učiť.

### Používateľská cesta cez chat

1. Používateľ poskytne odkaz a cieľ/firmu; chýbajúce údaje doplní v chate alebo UI. Agent overí skutočný root a aktuálny režim oprávnení.
2. Setup načíta `INSTALL.md` a presnú verziu release/manifestu. Výber verzie nie je tiché použitie pohyblivého latest/main. Agent identifikuje OS, architektúru, dostupné download/extract nástroje a Node.
3. Read-only preflight: prístup/cesta/dĺžka/kolízie/symlinky, lokálna dostupnosť a sync, existujúce dáta/konfigurácie/nadradené pokyny, autentifikácia a limity, runtime, miesto, sieť a plán zápisov. Pri neznámom bode pravdivý checkpoint; existujúca konfigurácia sa neprepisuje.
4. Agent predloží krátky plán konkrétnych súborov, sťahovania, runtime a checkpointov. Používateľ už povolený rozsah neopakuje pri každom kroku; technické schválenia klienta/OS sú samostatné a agent ich vysvetlí.
5. Agent v rámci oprávnení stiahne/verifikuje artefakty, pripraví runtime a deterministicky vytvorí systém/Olivera/adaptéry/ukážkový manuál. Apply kroky majú presný rozsah a obnoviteľnosť.
6. Uloží verziu, manifest vlastníctva a úspešné/neúspešné kroky v `.os-starter/`. Verify overí súbory, odkazy, generovanie a otvorenie manuálu; onboarding pokračuje podľa §5.
7. Nová session spustená z koreňa reálne načíta pokyny/profil, vyvolá Olivera a spracuje skúšobný vstup. Záver oddelí vykonané/overené, otvorené a recovery; samotné stiahnutie/binárka nie sú PASS.

Bežný webový chat bez lokálneho vykonávania nedokazuje inštaláciu na počítači. GitHub link nie je autentifikácia ani dokončený setup. Konkrétny flow každého klienta sa musí prakticky overiť.

### Schvaľovacie body a sandbox

Codex môže pri neversionovanom alebo nedôveryhodnom priečinku začať v read-only režime. V default workspace-write je sieť obmedzená a existujúce `.agents/`, `.codex/` a `.git` sú chránené aj vo writable roote. Sťahovanie, runtime mimo workspace a zapisovanie/regenerácia týchto adaptérov môžu vyžadovať schválenie alebo vhodné nastavenie v UI. `.claude/` a ďalšie cesty preveriť podľa skutočnej politiky; neoznačovať ich univerzálne rovnakou ochranou bez dôkazu. [Codex — Approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security)

Generátor zoskupí súvisiace povolené zápisy do jedného kontrolovateľného apply kroku/príkazu, ale **negarantuje jedno schválenie**. Počet, znenie a opakovanie dialógov závisia od verzie/politiky; runtime test ich zaznamená. To platí aj pri novom zamestnancovi neskôr. Zamietnutie alebo managed obmedzenie sa neobchádza. Nevypínať ochrany a nevynucovať full access ako default. Recovery pomenuje blokovaný krok, bezpečnú UI voľbu alebo odbornú pomoc.

### Distribúcia a runtime — prijaté vo v1.2

**Git nie je prerekvizita inštalácie účastníka.** Balík sa distribuuje ako verziovaný release archív plus manifest/SHA-256. Malý ASCII bootstrap pre sh a PowerShell používa overené dostupné natívne HTTP/extract nástroje (napr. curl/tar alebo PowerShell/Expand-Archive); ich prítomnosť sa testuje. Nemá závisieť od Node, ktorý ešte len pripravuje. Názvy/cesty používateľa sa prenášajú ako dáta, nie vkladaný shellový kód.

**Inštalátor aj generátory sa píšu v JavaScripte a spúšťajú cez Node.js.** Python/Ruby nie sú prerekvizity. Použiť vhodný existujúci Node v overenom kompatibilnom rozsahu, alebo získať presne pinnutý oficiálny Node LTS artefakt pre OS/architektúru. Výber konkrétnej LTS verzie/rozsahu a architektúr sa uzavrie cez testy pred buildom inštalátora. Sťahovať cez HTTPS z evidovaného pôvodu, overiť presné bajty voči pinnutému checksumu/overenému oficiálnemu SHASUMS; samotný hash stiahnutý z neovereného pôvodu nedokazuje pravosť.

Portable runtime je mimo synchronizovaných firemných dokumentov a bez admin zásahu či zmeny systémového PATH. Navrhnuté lokálne miesta: macOS `~/Library/Caches/company-os/runtime/<verzia>/<arch>/`, Windows `%LOCALAPPDATA%\company-os\runtime\<verzia>\<arch>\`; konkrétny zápis má vlastný rozsah oprávnení a test. Agent volá overenú binárku explicitne. Chýbajúci/odstránený cache sa bezpečne pripraví znovu. Per-device runtime cesta neprepíše spoločný sync config; na inom zariadení sa discovery vykoná znova.

Mermaid/YAML/Markdown závislosti a čítacie assets sú pribalené/verziované, bez CDN alebo povinného npm install pri bežnom generovaní. Bundled runtime klienta možno použiť iba pri jeho overenej dostupnosti/kompatibilite; nesľubovať Codex cestu Claude používateľovi. Pri nedostupnej sieti/artefakte alebo zamietnutom zápise uložiť checkpoint, nie simulovať úspech.

### Vlastníctvo súborov a update

| Trieda | Význam | Príklady | Aktualizácia |
|---|---|---|---|
| `package` | Balík vlastní systémový obsah | AGENTS, import CLAUDE, generátory, default systémové návody | Nahradiť len vlastnený nezmenený súbor po pláne; pri lokálnej zmene diff/rozhodnutie. |
| `generated` | Odvodené z aktuálnej kanoniky | Adaptéry, index tímu, text/mapy/HTML | Regenerovať z profilu/modelu; odstrániť len preukázateľne vlastnený zastaraný výstup. |
| `seeded` | Balík založí prvú verziu, potom ju vlastní používateľ | Oliver, Mapa systému, pracovná tabuľa, firma/O mne | Druhý setup ponechá; update iba diff a konkrétne potvrdenie migrácie. |
| `user` | Skutočné podklady a práca používateľa | Denné zápisky, zdroje, vlastné profily/modely a výstupy | Žiadny automatický reset/update/mazanie. Povolená bežná práca agenta podľa zadania zostáva možná. |

Manifest eviduje cestu, triedu, verziu, presný posledný vlastnený byte hash, odvodené vstupy a relevantné checkpointy. Seeded súbor sa po vytvorení nezmení na package len preto, že má starý template marker. `Mapa systému.md` môže mať balíkovú počiatočnú štruktúru, no ďalšiu úpravu vlastní firma. Vlastné pravidlá patria tam; ak používateľ zmení AGENTS priamo, update ich tiež zachová a ukáže konflikt.

Rovnaký setup nevytvorí duplicity, nezruší checkboxy a nezopakuje hotový onboarding. Pri update uviesť pin/changelog/diff a pred prepisom overenú zálohu. Automatický downgrade sa nevykoná; zámerný rollback použije preverený recovery plán. Migrácie schémy vo v1 len podľa konkrétneho plánu a potvrdenia, bez skrytého hromadného prepisu. Zlyhaný čiastočný apply uchová checkpoint/obnovu. Odstránenie alebo odinštalovanie sa týka iba známeho vlastneného systému; súkromné údaje sa nevymažú.

Súkromný workspace nemá automatický public remote/push. Git nie je default; voliteľná súkromná história nesmie byť prerekvizitou workshopu.

## 14. macOS, Windows a úložiská

Cieľ je macOS a Windows s Codexom aj Claude Code. Účastník vyberie plnú cestu; nevynucuje sa meno používateľa alebo cloud autora. Lokálny priečinok, Dropbox, OneDrive a Google Drive sú cieľové scenáre. Pred workshopom zistiť používané OS/architektúry/klientov/úložiská a prioritne otestovať ich kombinácie; neoverenú kombináciu označiť UNKNOWN, neodstrániť ju ticho z cieľového zadania ani sľubovať podporu.

Preflight overí Windows x64/ARM64 a macOS Intel/Apple Silicon podľa deklarovaného runtime, cestu a bezpečné názvy, lokálnu/offline dostupnosť, miesto a oprávnenia. Dlhé cesty vrátane OneDrive otestovať na konkrétnom systéme; limit závisí od OS/nástrojov/nastavení. Pri prekročení podporovaného limitu navrhnúť kratší root, nie tichú zmenu mena či globálneho nastavenia. Bootstrap ASCII, UTF-8 čítanie/zápis explicitné, žiadny predpoklad správnej implicitnej ANSI interpretácie PowerShellu 5.1.

Testovať medzery, diakritiku/NFC/NFD kolízie, CRLF, rezervované Windows názvy, symlinky, file locks, otvorený Obsidian súbor, sync konflikty/on-demand súbory, presun rootu a výzvy macOS na prístup. Existujúce názvy sa automaticky nenormalizujú; kolízia má checkpoint. Online-only placeholder alebo webový cloud odkaz nie je funkčný root. Účastník má návod na „ponechať na zariadení“ podľa poskytovateľa. Runtime/cache/tajomstvá sú mimo sync; sync nie je záloha.

Adaptéry a dokumenty používajú relatívne odkazy. Na druhom zariadení znova overiť lokálny runtime/oprávnenia a synchronizáciu, neprepísať shared config absolútnou cestou prvého počítača. Celý manuál s assets sa prenáša spolu.

Obsidian je voliteľný pohľad nad tým istým priečinkom; Markdown checkboxy nepotrebujú pluginy. Osobné workspace nastavenia autora sa nepribaľujú. Základná práca a manuál fungujú bez Obsidianu.

## 15. Obsah distribučného repozitára

Cieľový repozitár bude obsahovať README pre človeka, `INSTALL.md` pre agentový setup, setup skill, inštalátor, čisté šablóny, generátor adaptérov a procesov, lokálne reader assets, ukážky, návody, kontroly/testy, release manifest, changelog, licenciu a notices tretích strán. Súkromné podklady a prevádzková evidencia autora sa do balíka neprenášajú.

Pred verejným prenosom overiť vlastnú licenciu a redistribučné podmienky bundled js-yaml/Mermaid/Marked a zachovať notices. Public obsah neobsahuje súkromné cesty, klientov, ERP IDs, kontakty, osobné testy, prístupy, MCP konfigurácie ani súkromné cloudové odkazy. Príklady sú fiktívne, nie len premenované reálne klientské dáta. Šablóna a pracovný priestor účastníka sa nesynchronizujú cez spoločný public GitHub.

## 16. Akceptačné kritériá a dôkazy

Tieto testy sú požadovaným budúcim dôkazom; táto dokumentová revízia ich neoznačuje ako vykonané.

| ID | Scenár | PASS znamená |
|---|---|---|
| AC-01 | Nová inštalácia cez chat | Netechnický účastník dokončí cez chat/UI bez vlastných terminálových príkazov a povinného Gitu; uložený manifest zodpovedá skutočným súborom. |
| AC-02 | OS a AI klienti | Praktický flow macOS+Codex, macOS+Claude Code, Windows+Codex, Windows+Claude Code; fresh načítanie z koreňa. Podpriečinok bez Gitu je osobitný výsledok podľa klienta; pred jeho overením je zdokumentované obmedzenie a návrat do koreňa, nie automatický PASS. |
| AC-03 | Úložiská a presun | Deklarované lokálne/cloudové kombinácie, medzery/diakritika a presun rootu fungujú. Neoverená kombinácia je UNKNOWN, Mac-only výsledok ju nezastrešuje. |
| AC-04 | Opakovaný setup | Žiadne duplicity, reset onboardingu alebo zmeny seeded/user súborov; personalizácia aj checkboxy zostávajú zachované. |
| AC-05 | Upgrade a recovery | Lokálne zmenený package/seeded alebo cudzí config ostáva zachovaný; diff, záloha a potvrdený migračný plán; čiastočný apply má checkpoint/obnovu. Bez automatického downgradu. |
| AC-06 | Oliver a vyvolanie | Inline sprievodca zachová dialóg; nový chat načíta kanoniku. Rename mení ľudské meno, ID/príkaz ostáva stabilný; UI selector sa overí na konkrétnom povrchu, nepodporovaný variant má pravdivý fallback. |
| AC-07 | Nový zamestnanec | Jeden profil, index/routing, adaptéry a ľudský prehľad z tej istej kanoniky; validné metadáta a rename bez rozbitia väzieb; subagent len s povoleným delegovaním. |
| AC-08 | Proces a manuál | Model generuje významovo rovnaký text/mapu; neplatné vetvy/owner zastavia build pred poškodením výstupov; prázdny register/ukážka platné. Offline Chrome/Edge/Safari: text aj bez JS, mapa so zapnutým JS. |
| AC-09 | Trvalé pokračovanie | Odpovede/otázky sú v detaile, stav/vlastník/jediný ďalší krok na tabuli. Nový klient/chat nadviaže bez opakovania; ručná Obsidian zmena je rešpektovaná. |
| AC-10 | Znalostná báza | Ingest zachová presné originály, aktualizuje poznatky/index/log; query uvedie zdroje/neistotu; lint odhalí duplicitu/mŕtvy odkaz bez automatickej deštrukcie. |
| AC-11 | Denný trail | Správny deň/timezone, append dvoch session, retry bez duplicít/prepisu, prechod cez polnoc do správneho súboru; rozhodnutie oddelené od návrhu, summary má zdroje. |
| AC-12 | Samostatná skúška | Dva vstupy a druhá nová konverzácia; 1–2 netechnickí piloti vedia zadať, posúdiť a nájsť výstup bez zásahu autora. |
| AC-13 | Chýbajúci runtime/nástroj/sieť | Pravdivý checkpoint, overený byte checksum a pôvod runtime, správny OS/arch artefakt; pri zlyhaní nič nepredstiera pripojenie ani setup PASS. |
| AC-14 | Verejný release | Žiadne súkromné údaje/cesty/konfigurácie; licencie/NOTICE pre skutočne publikovaný obsah a assets overené; súkromný workspace sa neodosiela. Dokumentácia na review je odlíšená od inštalovateľného release. |
| AC-15 | Nadradené pokyny | Claude s nadradeným CLAUDE, Codex s override/global kontextom: preflight zistí dostupné relevantné pokyny, import/načítanie sa v fresh session preukáže; cudzia konfigurácia sa nemení a konflikt má checkpoint. |
| AC-16 | Sync a zastaraný zápis | Lokálna zmena po načítaní, otvorený Obsidian dokument a konfliktná kópia nezmiznú. Pred prechodom na druhé zariadenie overený sync/readback; neznáma aktuálnosť blokuje dotknutý zápis. Hash sa nevydáva za distribuovaný lock. |
| AC-17 | Nedôveryhodný zdroj | Wiki/meeting zdroj s vloženým pokynom nemení oprávnenia/kanonické pravidlá ani nespustí externú operáciu. Podklady zostávajú zachované, nález je vysvetlený. |
| AC-18 | UI schvaľovací flow | Codex na Macu/Windowse aj ďalší klient: skutočný počet/znenie schválení zdokumentované pri setupe aj novom zamestnancovi. Zamietnutie má recovery; nič nevynucuje full access a nesľubuje pevný počet dialógov. |

Test report: pin/verzia balíka, OS/architektúra, klient/verzia/režim oprávnení, typ úložiska, scenár, dátum, dôkaz, PASS/PARTIAL/FAIL/UNKNOWN a recovery. Source/unit kontrola, UI discovery a používateľský pilot sú samostatné dôkazy.

### Najmenší praktický pilot pred dokončením inštalátora

1. Na Macu a Windowse v podporovanom lokálnom klientovi otvoriť čistý neversionovaný koreň; zistiť účet/režim a schvaľovacie body bez vypínania ochrán.
2. Overiť stiahnutie/pin, dostupnosť alebo prípravu Node, presné checksumy a obmedzený zápis; potom fresh načítanie pokynov a inline Olivera. Jeden test má aj nadradený CLAUDE.
3. Uložiť stav/denný blok a založiť jednu odbornú rolu, aby sa preverila regenerácia adaptérov po setupe.
4. Overiť opakovanie nad personalizáciou; offline manuál a konfliktný/stale zápis. Na deklarovanom cloudovom priečinku zmeniť checkbox a prejsť na druhé zariadenie po dokončenom sync.

Pred širokým workshopovým releasom doplniť všetky štyri OS×klient základné kombinácie a deklarované cloudové scenáre/architektúry. Podporovaná podmnožina sa zverejní podľa dôkazov; ostatné zostávajú UNKNOWN a dostanú svoj test. Úspech malej skúšky neuzatvára celú maticu.

## 17. Otvorené technické body pre implementáciu a test

V1.2 uzatvára import CLAUDE, inline Olivera, ASCII stabilné ID, JavaScript/Node.js ako spoločný základ, distribúciu archívom bez povinného Gitu, štyri triedy vlastníctva, ISO dátumy a jediný marker `.os-starter/`. Tieto voľby sú prijaté zadanie, nie už vykonaný setup.

Otvorené zostávajú:

1. Pin podporovaných verzií klientov/Node, architektúry, účet/autentifikačná cesta a dostupné limity/náklady konkrétnych účastníkov.
2. Overená download/extract cesta na čistom Macu/Windowse, pôvod runtime a jeho príprava mimo workspace; presné UI schválenia a recovery.
3. Reálne natívne vyvolanie/selector, načítanie pri novej session a správanie z podpriečinka bez Gitu; prípadná bezpečná per-project root konfigurácia.
4. Doplňujúca schéma profilov/modelov, generátor indexov/adaptérov a generalizácia existujúceho reader/engine vrátane validačných/sanitizačných pravidiel.
5. Konkrétne cloudové sync prípady, obmedzenia cesty a súbežného editora, netechnický pilot a testovacia matica. Interný Mac dôkaz nie je dôkaz celého startera.
6. Licencia verejného balíka, verzie/licencie/NOTICE assetov a recovery aktualizácií. Licenčná voľba sa nerobí automaticky iba preto, že repo je verejné.

Review má uviesť konkrétny chýbajúci kontrakt alebo najmenší test, ktorý bod uzavrie. Povinné jadro Oliver/tím/procesný generátor/slovenčina/tabuľa/denný trail zostáva; materiálny konflikt potrebuje dôkaz a najmenšiu alternatívu zachovávajúcu cieľ.

## 18. Zdroje, dostupnosť podkladov a stav overenia

Tento dokument obsahuje celé zadanie potrebné na produktové/architektonické review z iného zariadenia. Súkromný Second Brain, osobné profily ani prevádzková evidencia autora nie sú potrebné.

Pôvodný interný harness/process-manual kód nie je publikovaný. Potreba odstrániť pevné firemné cesty/register/role/branding/platformové predpoklady je požiadavka §8; konkrétna vhodnosť reuse kódu a jeho licencie sú samostatné UNKNOWN checkpointy. Chýbajúci kód nebráni posúdeniu zadania, nevydáva sa však za overenú implementáciu.

Primárne zdroje načítané pri posúdení review 12.10.2026:

- [OpenAI — AGENTS](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Skills](https://learn.chatgpt.com/docs/build-skills), [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Approvals/security](https://learn.chatgpt.com/docs/agent-approvals-security).
- [Claude — Memory](https://code.claude.com/docs/en/memory#agentsmd), [Skills](https://code.claude.com/docs/en/skills), [Setup](https://code.claude.com/docs/en/setup).
- [Agent Skills specification](https://agentskills.io/specification), [Obsidian Properties](https://obsidian.md/help/properties), [LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).

Klientské technické údaje sú časovo citlivé; implementácia znovu preverí verzie/režimy z oficiálnych zdrojov. Konkrétna podporovaná verzia Node a pôvod artefaktu sú checkpoint, nie už vybraný release.

Claude read-only review pôvodnej v1.0 bolo PARTIAL bez P0. V1.2 zapracúva potvrdené opravy a korekcie: počet schválení sa negarantuje, hash neoverí vzdialený sync, checksum zdrojov/archívov používa presné bajty. Reviewer uviedol obmedzenie nezávislosti prostredia a nedostupnosť interného kódu; nejde o runtime pilot. Nový inštalátor, Windows/cloud scenáre, native selector a účastnícky pilot sú **NOT TESTED**. Druhé externé review v1.2 ešte neprebehlo.

## 19. Ďalší postup

1. Nezávisle overiť úplnosť a konzistenciu v1.2. Review pripraví materiálne nálezy/testy, samo nemení prijaté požiadavky.
2. Po zadaní implementácie začať najmenším platformovým pilotom podľa §16 a uzavrieť runtime/distribúciu/UI oprávnenia.
3. Nadviazať čistou implementáciou šablón, procesov a adaptérov; reusovať len posúdené/licenčne overené minimum.
4. Pred workshopovým releasom doplniť AC-01–18, deklarovanú platformovú maticu, netechnický pilot a recovery.

Publikácia špecifikácie nie je inštalovateľný release. V repozitári nie je samostatný review prompt; autor ho odovzdáva v chate.

## 20. Zmeny vo v1.2

- Tenký import CLAUDE → AGENTS, root-first a inventory aktívnych pokynov.
- Chat/UI schvaľovací flow, release archív bez povinného Gitu, JavaScript/Node.js ako spoločný základ a per-device runtime mimo sync.
- Inline Oliver, stabilné ID, display alias a generovaný index tímu; role/subagent hranice.
- Kanonický onboarding, stav/vlastník/jediný ďalší krok na tabuli.
- Package/generated/seeded/user, ochrana personalizácie, záloha/migrácia/recovery.
- ISO dátumy, presné byte checksumy, lokálna detekcia zmien a explicitné limity cloudu.
- Offline reader z file:// bez povinných modulov/fetch; platformový preflight, účty/verzie a byte budget.
- AC-15–18 a najmenší praktický pilot; jeden marker .os-starter.
