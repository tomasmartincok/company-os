---
type: specification
status: draft
version: "1.8"
created: 2026-10-12
updated: 2026-10-15
ai-generated: true
---

# company-os — kompletná špecifikácia v1.8

[Prehľad repozitára](../README.md)

**Autorita:** Tomáš 15.10.2026 schválil zjednodušenie inštalácie bez Node, voliteľný cloudový krok, testy a uloženie do Second Brainu aj na GitHub. V1.8 mení distribučný postup; predchádzajúce opravy a 19 akceptačných kritérií zostávajú s príslušnými úpravami zachované.

**Aktuálna fáza:** súborový základ s profilmi, mapou, tabuľou a jedným setup modelom. [Aktuálna inštalácia bez Node](simple-install.md) nahrádza predvolenú historickú Fázu 0. Oliver, ďalšie dva modely, generátor/manuál a plná integrácia účastníckeho modulu zostávajú ďalšou etapou. Starší [foundation report](core-foundation.md) je dôkaz pôvodného vydania; nepredstavuje test nového postupu. Audit prompt patrí iba do chatu.

**Repozitár:** [tomasmartincok/company-os](https://github.com/tomasmartincok/company-os), clone URL `https://github.com/tomasmartincok/company-os.git`.

## 1. Výsledok pre účastníka a rozsah

company-os je prenosný súborový pracovný systém firmy používaný cez lokálneho AI agenta a voliteľne Obsidian. Účastník vytvorí prázdny priečinok, otvorí ho v lokálnom Codexe alebo Claude Code a vloží krátky prompt s odkazom na GitHub. Agent prevezme hotové súbory z konkrétneho commitu bez inštalácie Node, Gitu alebo Pythonu. Voľbu cloudovej synchronizácie môže odložiť. Cieľom celého systému je, aby cez vedený rozhovor získal vlastný kontext, prispôsobeného Olivera, pracovnú tabuľu, prvého odborného AI zamestnanca a jeho proces.

Workshopový cieľ: človek vie zadať vlastnú úlohu, posúdiť výsledok, nájsť uložený výstup a zopakovať postup v novej konverzácii. Aktuálny rámec workshopu je približne šesť hodín, najviac osem účastníkov, workshop-first. Špecifikácia nesľubuje nový termín, miesto, cenu ani obchodný model.

### Povinné vo v1

- Slovenská, vysvetlená štruktúra Second Brainu a pravidlá zapisovania.
- Inštalácia a následné nastavenie vedené chatom; účastník nezadáva terminálové príkazy.
- Jeden preddefinovaný **Oliver — všeobecný stratég, pravá ruka a sprievodca systémom**, prispôsobiteľný účastníkom.
- AI tím: tvorba ďalších zamestnancov z vedeného rozhovoru, spoločné pravidlá a ľudský prehľad rolí.
- **Procesný generátor:** jeden model → návod pre človeka, strojovo čitateľný podklad pre agenta, Mermaid a HTML manuál.
- Jedna pracovná tabuľa s onboardingom, úlohami a pokračovaním medzi chatmi/modelmi.
- Lokálne účastnícke materiály cez Začnite tu: pracovný list so siedmimi promptmi P1–P7, tri fiktívne vetvy s demo kontextom/A/B/kritériami a offline HTML čítačka s kopírovaním a ručnou zálohou.
- Znalostná báza podľa LLM Wiki patternu: nemenné zdroje, odvodené poznatky, index a história zmien.
- Denné zápisky: samostatný súbor pre každý deň, viac session ako ďalšie bloky.
- Inventár nástrojov a zdrojov pravdy, oddelený od skutočných integrácií a oprávnení.
- Codex a Claude Code; macOS a Windows; zvolený lokálny alebo synchronizovaný priečinok.
- **Tri pripravené štartovacie procesy:** nastavenie firemného základu, vytvorenie AI zamestnanca a vytvorenie/úprava pracovného postupu (SOP). Každý má model, textový postup, mapu a väzbu na Oliverov workflow.
- **Hotový lokálny HTML manuál po inštalácii:** tri štartovacie procesy a Oliver, ich zodpovednosti a vzájomné odkazy; prehľady sa obnovujú pri tvorbe/úprave rolí a procesov.
- Čistá fiktívna ukážka a dva vstupy na skúšku bez firemných účtov; označené oddelene od štartovacích systémových procesov.
- Bezpečné opakovanie setupu, zachovanie personalizácie a dát, verzia a overiteľný stav inštalácie.

### Voliteľné ukážky

Zjednodušený Blog Writer a vzor spracovania stretnutia. Obsah môže byť pribalený ako ukážka; ich aktivácia nesmie byť podmienkou dokončenia základného onboardingu. Voliteľná schopnosť má vlastné deklarované závislosti.

### Hranice základného balíka

Balík pripraví pracovný priestor a postupy. Pripojenie firemných účtov, externé integrácie a oprávnenia na odosielanie či publikovanie sa nastavujú osobitne podľa potrieb firmy. Oliver je jediný preddefinovaný úvodný zamestnanec; ďalšie roly si účastník vytvára s jeho pomocou.

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
| Základná schéma metadát | `AI OS/Systém/Schémy/poznamka.schema.json` (package); ľudský návod je odvodený |
| Základné ukladanie, deduplikácia a odkazy | `AI OS/Postupy/ukladanie-a-deduplikacia.md` (package) |
| Firemný routing a kompatibilné rozšírenia metadát | `Mapa systému.md` (seeded/user); odkazuje na balíkový základ |
| Vlastné pravidlá a nastavenia používateľa vrátane denného trailu | `Mapa systému.md`, sekcia Vlastné pravidlá a nastavenia |
| Inventár nástrojov a dôkazy pripojenia | `Práca/Firma/Nástroje.md` |
| Definícia etáp, šablóny otázok a kritériá dokončenia | `Procesy/system-nastavenie-firmy/model.yaml`; Oliverov workflow je odvodený agentový vstup |
| Index tímu a routing | Generovaný `AI OS/Tím/index.md` z kanonických profilov |
| Checkboxy dokončenia, aktuálne nezodpovedané otázky nastavenia, stav úloh, vlastník a jediný ďalší krok | `Pracovná tabuľa.md` |
| Zadanie, odpovede a otvorené otázky konkrétnej úlohy | Jej pracovný dokument pri príslušnom subjekte |
| Definícia zamestnanca | Jeho jeden kanonický profil `SKILL.md` |
| Definícia štartovacieho alebo vlastného procesu | Jeho jeden `model.yaml`; text, mapa, HTML a procesné kroky agentového workflowu sú odvodené |
| Pôvodné podklady | Originál pri subjekte alebo v `Znalostná báza/Zdroje/` |
| Odvodené poznatky | `Znalostná báza/Spracované poznatky/` so zdrojmi |
| História práce | Dátovaný denný súbor |
| Verzia a vlastnenie inštalovaných súborov | Zdieľaný manifest `.os-starter/`, menený iba apply/update |
| Aktuálny trust/sync a kontrola konkrétneho zariadenia | Nový preflight; potvrdenie z iného zariadenia sa nepreberá. Rozšírená lokálna evidencia je budúci kontrakt (§13). |

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
│   │   └── oliver/
│   │       ├── SKILL.md
│   │       ├── workflows/
│   │       │   ├── nastavenie-systemu/SKILL.md
│   │       │   ├── tvorba-zamestnanca/SKILL.md
│   │       │   ├── tvorba-procesu/SKILL.md
│   │       │   └── sprava-znalostnej-bazy/SKILL.md
│   │       └── references/
│   ├── Postupy/             # package, spoločné pre roly
│   │   ├── pracovna-tabula.md
│   │   ├── ukladanie-a-deduplikacia.md
│   │   ├── inbox-a-napady.md
│   │   ├── denny-trail.md
│   │   └── kontrola-vysledku.md
│   └── Systém/
│       ├── Schémy/
│       │   └── poznamka.schema.json
│       ├── Návody/
│       │   ├── Metadáta.md     # generated zo schémy
│       │   └── Synchronizácia a zálohovanie.md
│       ├── Šablóny/
│       └── Generátor/
├── Procesy/
│   ├── system-nastavenie-firmy/   # model.yaml + postup.md + postup.mmd
│   ├── system-tvorba-zamestnanca/ # model.yaml + postup.md + postup.mmd
│   ├── system-tvorba-postupu/     # model.yaml + postup.md + postup.mmd
│   └── <vlastné-stabilné-id>/
│       ├── Príprava.md
│       ├── model.yaml
│       ├── postup.md
│       └── postup.mmd
├── Manuál/
│   ├── index.html
│   ├── tim.html
│   ├── procesy/
│   │   └── <proces-id>.html       # pre každý z troch štartovacích aj vlastných modelov
│   └── assets/
├── Workshop/
│   ├── pracovny-list-a-prompty.md
│   ├── ukazkove-vstupy.md
│   ├── index.html
│   └── assets/
├── workshop-component-manifest.json  # generated evidencia obsahu Workshop/
├── Ukážky/
│   └── Workshop/
│       └── <vetva>/             # fiktívne zadanie, vstupy A/B a výstupy; vzniká pri skúške
├── .agents/skills/
├── .codex/agents/
├── .claude/skills/
├── .claude/agents/
└── .os-starter/
```

Strom je cieľová šablóna, nie hotová implementácia. Tri štartovacie procesy a Oliver sú povinným počiatočným obsahom úspešnej inštalácie. Vlastný procesový adresár vzniká pri skutočnom zadaní; vlastný potvrdený model až po obsahovom rozhodnutí. Fiktívne ukážky sú označené a oddelené od štartovacích systémových postupov aj vlastných procesov. Register s nulou vlastných procesov/odborných zamestnancov je platný, ale po úspešnej inštalácii zobrazuje tri štartovacie procesy a Olivera.

Viditeľné názvy sú slovenské a popisné. `Atlas`, `Inbox` a `AI OS` majú vysvetlenie účelu. Povinné platformové názvy `AGENTS.md`, `SKILL.md`, `.agents`, `.codex`, `.claude` zostávajú zachované. Technické ID a názvy adaptérov sú stabilné, krátke a bez diakritiky; ľudské mená môžu mať diakritiku.

**Predvolené nastavenie v1.7:** balík obsahuje jednoriadkový `CLAUDE.md` s `@AGENTS.md`. Je to technický import, neobsahuje druhú kópiu pravidiel. Priame čítanie AGENTS v Claude závisí od verzie/režimu a prítomnosti nadradených CLAUDE súborov; import je zvolená kompatibilná cesta. Preflight vypíše relevantné projektové/nadradené/globálne pokyny a konflikty vrátane Codex override súborov. Cudzí config nemení. Import nezaručuje izoláciu od nadradených pravidiel ani prekonanie managed režimu; skutočné načítanie musí potvrdiť nová session. [Claude — Memory](https://code.claude.com/docs/en/memory#agents-md)

## 4. Obsah základných dokumentov

| Súbor | Požadovaný obsah |
|---|---|
| `Začnite tu.md` | Jednostránkový vstup: účel systému, potrebný klient/účet, otvorenie koreňa, offline dostupnosť, očakávané UI schválenia, vyvolanie Olivera, odkaz na `Pracovná tabuľa.md#Dokončenie company-os`, príklady zadaní, manuál a recovery; blok Workshop: vlastný zamestnanec s poradím P1–P7, odkazy na lokálny pracovný list/ukážky/čítačku a po dodaní skutočného manuálu na `Manuál/index.html`. |
| `AGENTS.md` | Balíkom udržiavaný vstup: poradie čítania, načítanie indexu tímu pri výbere roly, pracovné zásady, autorizácia, ukladanie, pokračovanie, denné zápisky a kontrola. Odkazuje na Vlastné pravidlá a nastavenia v `Mapa systému.md`. Cieľ najviac 8 KiB UTF-8; nadradená reťaz sa overuje osobitne. |
| `CLAUDE.md` | Jednoriadkový technický import `@AGENTS.md`, bez druhej kópie pravidiel. |
| `O mne.md` | Predpripravené sekcie Meno a oslovenie, Rola, Jazyk a komunikácia, Pracovné preferencie, Rozhodovanie a Spolupráca s AI. |
| `Prehľad firmy.md` | Predpripravené sekcie Firma a web, Ponuka, Zákazníci, Odlišnosti, Ľudia a zodpovednosti, Aktuálne priority, Potvrdené rozhodnutia a Zdroje a neznáme. Odkaz na inventár nástrojov. |
| `Mapa systému.md` | Mapa celého pracovného priestoru: účel oblastí, firemný routing, autorita údajov a odkazy na balíkové postupy/schému. Vlastné pravidlá a nastavenia obsahujú preferencie vrátane denného trailu a kompatibilné rozšírenia podľa §12. Základnú schému ani kroky spoločných postupov nekopíruje. Znalostná báza je jednou z oblastí mapy. |
| `Pracovná tabuľa.md` | Jediné miesto so stavom dokončenia a aktuálnymi otázkami nastavenia, potom prehľad reálnej práce. Stav, vlastník, ďalší krok a odkazy; §6. |

Profily sa nevytvárajú ako prázdne súbory. Obsahujú metadata podľa §12, H1, relevantné odkazy, krátke vysvetlenie a pripravené sekcie s označením `Zatiaľ nedoplnené`. Neznáme údaje sa nevymýšľajú. Konkrétne otázky na doplnenie sú na tabuli; potvrdené odpovede iba v príslušnom profile. Stav dokončenia profilu sa z tabule nekopíruje do ďalšieho checklistu.

### Povinné správanie AGENTS

Na začiatku session agent číta `Prehľad firmy.md`, `O mne.md`, `Mapa systému.md` a relevantnú časť tabule. Pri nedoplnených profiloch načíta dostupné údaje a pokračuje zadanou prácou. Otázkou z tabule začína pri onboardingu alebo bez konkrétneho zadania. Pri bežnej úlohe sa pýta iba na chýbajúci údaj potrebný na jej výsledok; nepovinné nastavenie ponúkne najviac raz za session a jeho odmietnutie či prerušenie rešpektuje. Otvorený onboarding neblokuje P6 ani inú úlohu s dostatočným kontextom a oprávneniami. `Začnite tu.md` číta pri onboardingu alebo vysvetľovaní. Pri výbere aliasu/roly číta `AI OS/Tím/index.md` a relevantný profil, potom len potrebný workflow. AGENTS neobsahuje vlastný zoznam zamestnancov ani kópie ich postupov. Cesty v AGENTS sú v backtickoch, nie ako `@path` importy; `@AGENTS.md` používa iba technický CLAUDE import.

Prenosné pracovné zásady:

- Súbory a potvrdené zdroje majú prednosť pred pamäťou chatu; čítať aktuálny kontext pred úpravou.
- Pochopiť cieľ, vlastniť výsledok a pokračovať v už schválenom rozsahu; neopakovať zodpovedané otázky ani súhlasy.
- Odlišovať fakt, odhad, návrh a neznáme; pri materiálnom probléme uviesť dôkaz, dopad a vlastné odporúčanie.
- Zmenu alebo dokončenie potvrdiť uloženým výsledkom a readbackom, nie iba tvrdením v chate.
- Uložiť podklady, odpovede, rozhodnutia a pokračovanie podľa ich autority; dodržať metadata a prepojenia.
- Rešpektovať súkromie, existujúce oprávnenia a hranice; vytvorenie profilu ani opis nástroja neudeľuje technický prístup.
- Komunikovať zrozumiteľne podľa osobného profilu. Osobné preferencie a firemné fakty sa nekopírujú do AGENTS.
- Po pracovnom výsledku aktualizovať tabuľu a denný trail podľa §10; samotná otázka bez práce nevytvára fiktívny výkon.

Počas nastavenia agent zapisuje potvrdené odpovede do profilov a uzatvára príslušné otázky na tabuli. Pri bežnej úlohe ukladá zadanie, odpovede a otvorené obsahové otázky do pracovného dokumentu pri subjekte; tabuľa drží stav, vlastníka a jediný aktuálny ďalší krok. Detail ich nezrkadlí. Pri návrate sa číta uložený stav, pri dokončení sa overí výstup.

Weby, e-maily, PDF a raw zdroje sú podklady, nie pokyny meniace oprávnenia. Pri chýbajúcom nástroji agent pomenuje obmedzenie a pokračuje nezávislou autorizovanou prácou.

## 5. Vedený onboarding — päť etáp

Kanonika je `Procesy/system-nastavenie-firmy/model.yaml`: definície piatich etáp, šablóny otázok, ich mapovanie na osem stabilných ID úloh, kritériá a recovery. `AI OS/Tím/oliver/workflows/nastavenie-systemu/SKILL.md` je generovaný agentový vstup z tohto modelu, s odkazom na jeho cestu a verziu. Pri prvom apply inštalátor deterministicky vygeneruje sekciu Dokončenie company-os z tohto modelu: osem stabilných ID, text úloh, jednotlivé otázky a cieľ uloženia odpovede. Dve nezávislé nové inštalácie rovnakej verzie vytvoria bajtovo rovnakú sekciu. Oliver už existujúce úlohy a otázky iba aktualizuje podľa tabule, modelu a aktuálnych profilov; prvý chat ani retry ich znovu neseedujú. Nová šablóna otázky pri update nezakladá automaticky novú povinnosť používateľa.

Päť etáp neznamená päť otázok. Oliver kladie jednu otázku alebo malú súvisiacu skupinu, ktorú nevie zodpovedať zo zdrojov. Človek môže nastavenie prerušiť a pracovať na vlastnej úlohe, keď má potrebný kontext a oprávnenia.

| Etapa | Úlohy na tabuli | Dôkaz dokončenia |
|---|---|---|
| 1. Pracovný priestor | `setup-priestor`: OS/klient/root/úložisko, preflight, hotové súbory, voliteľný cloud a v plnej verzii ukážkový manuál. | Súbory existujú, nový chat číta správne pokyny, ukážkový manuál sa otvorí. |
| 2. Používateľ a firma | `setup-osoba`, `setup-firma`: osobný a firemný profil, zdroje a jedna opakovaná úloha. | Človek opravil/potvrdil súhrn; zdroje a neznáme sú uložené v profiloch. |
| 3. Oliver, nástroje a hranice | `setup-oliver`, `setup-nastroje`: spolupráca, kompetencie, nástroje, autorita údajov a oprávnenia. | Profil a inventár uložené; projektový Oliver reálne vyvolaný; používaný nástroj odlíšený od overeného pripojenia. |
| 4. Zamestnanec a proces | `setup-zamestnanec`, `setup-proces`: výsledok, podklady, postup, vetvy, kontrola a umiestnenie výstupu. | Profil + proces potvrdené; model validný; text/mapa/index majú rovnaký proces a vlastníkov. |
| 5. Samostatná práca | `setup-vstupy`: prvý vstup, kontrola a druhý vstup v novom chate. | Používateľ vie zadať, posúdiť a nájsť výstup; tabuľa a denný trail zodpovedajú výsledku. |

Checkboxy sú iba na tabuli. Dokončenie etapy sa odvodí z jej úloh; nevzniká paralelný etapový stavový súbor. Agent odklikne úlohu po overení konkrétneho dôkazu. Ručnú zmenu človeka rešpektuje; pri rozpore s dôkazom pomenuje rozdiel a vyžiada len potrebné objasnenie, neprepíše checkbox ticho. Nedokončená úloha má ďalší krok alebo dôvod čakania. Po dokončení sa onboarding nevnucuje pri každej práci.

### Web a firemný profil

Účastník môže poskytnúť URL alebo dokumenty. Agent uvedie URL/dátum, vyberie základné údaje a predloží súhrn na opravu/potvrdenie. Interné procesy, vlastníkov, právomoci ani strategické ciele nedoplní bez podkladu a potvrdenia. Pri nedostupnom browse pokračuje s opisom používateľa.

### Inventár nástrojov

`Práca/Firma/Nástroje.md`: názov, účel, vlastník, autoritatívne údaje, miesto dát, spôsob práce, bezpečná referencia na prístup a stav `používaný / pripojený a overený / pripraviť neskôr`. Overený prístup má dátum a rozsah skúšky. Heslá, tokeny, recovery kódy a privátne kľúče zostávajú mimo poznámok. Oprávnenia pre konkrétne externé zásahy majú potvrdený rozsah; všeobecné preferencie používateľa ich nenahrádzajú.

## 6. Pracovná tabuľa a trvalé pokračovanie

Tabuľa je Markdown dashboard čitateľný v Obsidiane bez pluginov. Sekcie: **Dokončenie company-os / Teraz / Čakáme na / Neskôr / Dokončené**. Základné nastavenie má všetky aktuálne úlohy a nezodpovedané otázky na jednom mieste. Odpovede a dôkazy sa ukladajú do autoritatívneho profilu alebo pracovného dokumentu a tabuľa na ne odkazuje.

Každá úloha má nemenné ID v HTML komentári na riadku checkboxu: `<!-- os:task:<id> -->`. ID sa neodvodzuje z textu ani poradového čísla riadku; viditeľný text môže človek meniť. Vlastník a jediný konkrétny ďalší krok patria tabuli; termín iba ak je dohodnutý. Pri nastavovaní sú tu aj otázky, ktoré ešte treba zodpovedať. Pri bežnej úlohe je na tabuli stručný krok a odkaz, podrobný dotazník patrí jej pracovnému dokumentu.

```markdown
# Pracovná tabuľa

> **Súvisí s:** [[Začnite tu]] · [[Mapa systému]] · [[O mne]] · [[Prehľad firmy]] · [[AI OS/Tím/index|AI tím]]

## Dokončenie company-os

- [ ] Overiť pracovný priestor a manuál <!-- os:task:setup-priestor -->
  - Vlastník: používateľ + Oliver.
  - Ďalší krok: overiť načítanie pokynov v novom chate z koreňa.
  - Overiť: správny priečinok, lokálna dostupnosť, Oliver a otvorenie ukážkového manuálu.
- [ ] Doplniť a potvrdiť osobný profil <!-- os:task:setup-osoba -->
  - Vlastník: používateľ + Oliver.
  - Ďalší krok: zodpovedať prvú chýbajúcu otázku.
  - Otázky:
    - Ako ťa oslovovať?
    - Aká je tvoja rola?
    - Aký jazyk, tón a podrobnosť preferuješ?
    - Ako chceš spolupracovať a rozhodovať?
  - Odpovede: [[O mne]]
- [ ] Doplniť a potvrdiť profil firmy <!-- os:task:setup-firma -->
  - Vlastník: používateľ + Oliver.
  - Ďalší krok: doplniť opis firmy alebo web.
  - Otázky:
    - Čo firma robí a predáva?
    - Komu pomáha?
    - Čím sa odlišuje?
    - Kto za čo zodpovedá?
    - Aké sú dnešné priority?
  - Odpovede: [[Prehľad firmy]]
- [ ] Prispôsobiť Olivera <!-- os:task:setup-oliver -->
  - Vlastník: používateľ + Oliver.
  - Ďalší krok: určiť jeho hlavné zodpovednosti.
  - Otázky:
    - Ako sa má volať?
    - S čím má pomáhať?
    - Za ktoré výsledky zodpovedá a kde sú jeho hranice?
  - Profil: [[AI OS/Tím/oliver/SKILL|Oliver]]
- [ ] Doplniť nástroje a oprávnenia <!-- os:task:setup-nastroje -->
  - Vlastník: používateľ + Oliver.
  - Ďalší krok: pomenovať používané nástroje a autoritu údajov.
  - Otázky:
    - Aké nástroje používaš?
    - Kde je zdroj pravdy?
    - Čo môže agent vykonať a čo potrebuje schválenie?
  - Odpovede: [[Práca/Firma/Nástroje]] · [[Mapa systému]]
- [ ] Vytvoriť prvého odborného zamestnanca <!-- os:task:setup-zamestnanec -->
  - Vlastník: používateľ + Oliver.
  - Ďalší krok: vybrať jednu opakovanú úlohu a výsledok.
  - Otázky:
    - Kedy sa použije?
    - Čo má dodať?
    - Z akých podkladov?
    - Kto výsledok kontroluje?
  - Profil: doplniť existujúci cieľ po vytvorení zamestnanca.
- [ ] Opísať a potvrdiť prvý proces <!-- os:task:setup-proces -->
  - Vlastník: používateľ + Oliver.
  - Ďalší krok: opísať spúšťač a priebeh procesu.
  - Otázky:
    - Aké sú kroky, rozhodnutia, vstupy, chyby, kontrola a výsledok?
  - Príprava a manuál: doplniť existujúce ciele po vytvorení procesu.
- [ ] Overiť prácu na dvoch vstupoch <!-- os:task:setup-vstupy -->
  - Vlastník: používateľ + Oliver.
  - Ďalší krok: spracovať prvý vlastný vstup; druhý overiť v novom chate.
  - Dôkaz: uložené výstupy, kontrola a nadviazanie bez opakovania hotových otázok.

## Teraz
## Čakáme na
## Neskôr
## Dokončené
```

Vzorka ilustruje deterministický výstup prvého apply z modelu; nie je druhou redakčnou šablónou otázok. Skutočný setup odklikne iba preukázané kroky. Každá otázka má samostatnú vnorenú odrážku. Zodpovedanú otázku označí na jej odrážke `Vyriešené → odkaz na profil/detail alebo konkrétnu sekciu`; nemaže ju a nekopíruje sem odpoveď. Nevkladá fiktívne klientské úlohy. Zápis `Profil: doplniť` nie je mŕtvy wiki-link. Preflight údaje a technické verify/recovery konkrétneho zariadenia patria lokálnej evidencii, tabuľa drží používateľský ďalší krok.

**ID a ručné zmeny:** nové jednoznačne používateľské úlohy dostanú pred prvým agentovým stavovým zápisom nové stabilné `user-<uuid>` ID. Riadok bez ID, ktorý môže byť upravenou štartovacou úlohou, zostane zachovaný; agent navrhne obnovenie väzby a vyžiada len potrebné objasnenie. Chýbajúce štartovacie ID nevyvolá tichý re-seed ani domnienku dokončenia. Duplicitné ID zastaví stavovú mutáciu dotknutých riadkov; človek potvrdí, či ide o duplicitu alebo dve úlohy, potom sa opravia iba ich väzby. Nedotknutá práca môže pokračovať. Neznáme alebo neplatné ID mimo štartovacích ID modelu a validného `user-<uuid>` sa zachová; agent čaká s dotknutou stavovou mutáciou na potvrdenie väzby. Ani preklep typu `setup-osba` nevyvolá automatickú opravu alebo re-seed. Ostatná práca pokračuje. Pred aj po patchi sa overí platnosť/jedinečnosť ID, zachovanie checkboxov a odkazy na jednotlivé odpovede.

Pri „chcem popísať proces“ Oliver najprv vyhľadá existujúcu prípravu, uloží cieľ/obsahové otázky pri procese a pridá jednu položku na tabuľu. Po potvrdení pripraví model a vygeneruje pohľady. Prerušenie zachová podklady; nový chat nadviaže na tabuľu a detail. Ukončená príprava ďalej nevedie druhý normatívny postup popri modeli.

Voliteľná úloha **Nastaviť synchronizáciu a zálohovanie** je v sekcii Neskôr, má stabilné používateľské UUID a odkaz na návod. Nie je deviatou povinnou etapou onboardingu. Zostáva otvorená pri lokálnom štarte aj pri cloudovom priečinku bez doloženého prenosu a obnovy; opakovanie ju neseeduje znova.

## 7. Oliver a tvorba AI tímu

### Predvolený Oliver

Všeobecný stratég, pravá ruka a sprievodca firemným systémom. Pri inštalácii funguje s neutrálnym profilom; človek na workshope prispôsobí meno, spoluprácu, kompetencie a firemný kontext. Oliver je inline skill v hlavnom rozhovore, bez `context: fork` a bez predvoleného adaptéra subagenta; zachováva dialóg používateľa. Ohraničené úlohy možno delegovať dostupným odborným rolám. Samostatný druhý úvodný asistent sa nevytvára.

Oliver vie vysvetliť systém a manuál, pomôcť s prioritami, viesť onboarding, tvorbu zamestnancov/procesov/znalostnej bázy, ukladať pracovný stav a koordinovať primeranú kontrolu. Nevymýšľa právomoci; cenu, záväzok, externé odoslanie a produkciu rieši podľa potvrdených hraníc. Riadi sa zdrojmi v §2 a vlastnými postupmi, nie súkromným kontextom autora, osobným profilom či klientskymi výnimkami.

### Jeden kanonický profil

Profil v `AI OS/Tím/<id>/SKILL.md` je jediná editovateľná definícia zamestnanca. `name` = stabilné ID = názov priečinka; v tomto balíku je ID 1–64 znakov z `[a-z0-9-]`, nesmie začínať ani končiť pomlčkou, ani obsahovať dve pomlčky za sebou. ASCII je naša voľba prenosnosti; Agent Skills štandard povoľuje aj Unicode lowercase alfanumerické znaky. `description` má 1–1024 znakov, obsahuje účel/triggery; ľudský alias sa do generovaného description adaptéra odvodí z `metadata.display_name`, s dodržaním limitu.

V `metadata` sú stringové položky `display_name`, `role`, `delegation` (`disabled` alebo `allowed`) a `access_mode` (`read-only` alebo `read-write`); nástroje, výsledky, zdroje, hranice, kontrola a procesové odkazy sú v tele profilu. Presné doplňujúce polia validátor uzavrie pred implementáciou, údaje sa neupravujú vo viacerých registroch. Oliver má ID `oliver` a `delegation: disabled` pre svoj vlastný natívny subagent adapter; tým sa nevypína jeho koordinácia odborných úloh. [Agent Skills specification](https://agentskills.io/specification)

Z profilu sa odvodia routing/discovery údaje, tenké natívne adaptéry a ľudský prehľad tímu. Osobný názov/alias a funkčné ID sú odlíšené; proces odkazuje na stabilné ID, aby premenovanie AI zamestnanca nerozbilo väzby. Zmena profilu obnoví index/routing `AI OS/Tím/index.md`, dotknuté adaptéry a HTML. UI meno v `agents/openai.yaml` je odvodené z `metadata.display_name`; technické vyvolanie ostáva podľa ID. Návod vysvetlí, že zmena aliasu nemení `/oliver` alebo `$oliver`; prirodzené oslovenie používa alias cez index. Generované súbory sa ručne neupravujú.

### Priečinok zamestnanca a interné workflowy

Každý zamestnanec má vlastný priečinok `AI OS/Tím/<id>/`: jeden rolový `SKILL.md`, podľa potreby `workflows/<workflow-id>/SKILL.md`, `references/`, `scripts/` a `assets/`. Tieto pomocné adresáre vznikajú podľa obsahu; nemusia byť prázdnou povinnou dekoráciou. Oliver obsahuje štyri systémové workflowy uvedené v §3; vlastná odborná rola môže mať napríklad workflow tvorby článku.

- Rolový skill vlastní výsledok, triggery, hranice a odkazy na vhodné postupy.
- Workflow je opakovateľný postup jednej činnosti s krokmi, vstupmi, výstupmi a kontrolou. Jeho `name` je zhodné s názvom rodičovského priečinka `<workflow-id>` a dodrží rovnaký formát/limit ako rolové ID. Vlastník je v stringovom `metadata.role_id`; jedinečný interný registry key je dvojica `<role-id>/<workflow-id>`, nie zložené frontmatter name. Cesta a ID sa evidujú explicitne, nevznikajú odvodením z ľudského názvu.
- Referencie nesú doplňujúce podklady. Výstupy práce patria k firme/klientovi/projektu, nie medzi definície zamestnanca.
- Subagent je dočasný vykonávateľ ohraničeného zadania, nie názov vnoreného workflowu.
- Generátor vytvára používateľské adaptéry len z rolových profilov. Vnorené workflowy načítava rola podľa potreby; nevystavujú sa automaticky ako ďalší zamestnanci ani samostatné slash príkazy.

`AI OS/Postupy/` slúži iba pre skutočne spoločné postupy viacerých rolí. Každý postup má jednu kanoniku; profil odkazuje na existujúci workflow alebo spoločný postup, nekopíruje jeho obsah. Generátor rozlišuje rolové a workflow SKILL súbory podľa cesty a metadát. Oliverov hlavný profil je seeded. Tri štartovacie procesové modely sú seeded, používateľ ich môže neskôr prispôsobiť; ich tri Oliverove workflowy a všetky textové/mapové/HTML pohľady sú generated. Zvyšný distribuovaný workflow správy znalostnej bázy je package, kým nemá vlastný procesný model. Vlastný nemodelovaný workflow je user; po vedomom prevedení na proces sa jeho kroky/otázky presunú do jedného user modelu a agentový workflow sa generuje. Package aj lokálne zmenené generated súbory majú ochranu podľa §13; žiadne tiché zahodenie úprav. Profil ostáva kanonikou roly, model kanonikou opakovateľného postupu.

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

Procesný generátor je povinná schopnosť v1. Výber implementácie má zachovať jednu kanoniku a prenosnosť; prípadné opätovné použitie kódu vyžaduje technické a licenčné posúdenie.

### Jeden model, viac pohľadov

Procesový model `model.yaml` má stabilné ID, jedinečné stabilné step ID a odkazy vetiev na tieto step ID, názov, verziu/dátum, účel/spúšťač, ľudského vlastníka, zúčastnené role, vstupy, výsledok, zdroje, pravidlá/hranice, kroky, rozhodovacie vetvy, kontrolu, chyby/recovery a dôkazy. Agent číta štruktúru a príslušné skills; samotný diagram nie je deterministický vykonávač.

Generátor z modelu vytvorí `postup.md`, `postup.mmd` a HTML text/mapu. Manuál zobrazí prehľad procesov, prehľad tímu a vzájomné odkazy. Obsah textu a mapy musí sedieť; úprava sa vykonáva v modeli, potom build/check.

### Povinný štartovací obsah — tri hotové procesy

Úspešná nová inštalácia doručí už pripravené modely a vygenerované texty/mapy/HTML. Účastník ich nemusí najprv navrhnúť. Sú to použiteľné systémové postupy, nie dôkaz, že firma dokončila nastavenie alebo vykonala proces. Ľudský vlastník je používateľ v tejto funkcii; konkrétne meno sa doplní z potvrdeného profilu. Oliver vedie rozhovor a vykonáva autorizované dokumentové kroky, používateľ potvrdzuje fakty, zodpovednosti a význam výsledku.

| Proces a stabilné ID | Oliverov workflow | Vstupy a výstup | Kontrola |
|---|---|---|---|
| **Nastavenie firemného základu** `system-nastavenie-firmy` | `nastavenie-systemu` | Funkčný root/klient a opis/web/podklady → prepojené osobné a firemné údaje, priority, nástroje/hraničné pravidlá a rozpracované úlohy nastavenia. | Potvrdené fakty so zdrojmi, neznáme označené, aktuálne otázky/ďalší krok na tabuli; nadviazanie v novom chate. |
| **Vytvorenie AI zamestnanca** `system-tvorba-zamestnanca` | `tvorba-zamestnanca` | Vybraná oblasť a požadovaný výsledok → vlastný rolový priečinok/profil, zdroje, zodpovednosti, hranice a návrh prvého workflowu, aktualizovaný register/adaptéry/manuál. | Potvrdený profil, stabilné ID, správne natívne vyvolanie; rola nepridáva implicitné prístupy. Overenie pracovného workflowu nadväzuje cez tretí proces. |
| **Vytvorenie alebo úprava pracovného postupu (SOP)** `system-tvorba-postupu` | `tvorba-procesu` | Rola, konkrétna opakovaná úloha a zdroje/existujúci postup → jeden model, agentový workflow, text, Mermaid a HTML; dôkazy dvoch vstupov alebo otvorený checkpoint. | Vstupy/kroky/vetvy/vlastníci/výstup/kontrola/recovery úplné, význam mapy a inštrukcií zhodný; prvý test, oprava a druhý vstup v novom chate. |

Každý model obsahuje účel/spúšťač, ľudského vlastníka, agentové role, vstupy/výstupy, otázky a miesto odpovedí, kroky/rozhodnutia, schvaľovanie, chyby/recovery a kritériá dôkazu. Nastavenie používateľa nie je fiktívna hotová firma: model má všeobecné otázky a hranice, osobné/firemné odpovede zostávajú v príslušných dokumentoch.

### Jedna kanonika modelu a agentové vedenie

Pre tri štartovacie procesy sú kroky, otázky, vetvy a kritériá editovateľné iba v `Procesy/<id>/model.yaml`. Z modelu sa odvodia `postup.md`, `postup.mmd`, `Manuál/procesy/<id>.html` a príslušný workflow SKILL. Generovaný workflow má štandardné name/description/metadata, označenie pôvodu a explicitnú cestu/verziu modelu; nevlastní druhý ručne editovateľný postup. Oliverov rolový profil odkazuje na tieto vstupy, nenesie ich kópie. Spoločné zásady AGENTS/Mapy systému sa do modelu nekopírujú; model na ne odkazuje.

Oliver pri vedenom rozhovore skutočne použije príslušný aktuálny model a odvodený workflow: kladie otázky podľa kroku, uloží odpoveď na určené miesto, rešpektuje potvrdenie a doplní tabuľu/denný trail. HTML slúži človeku ako pohľad na ten istý postup. Zmena modelu obnoví všetky dotknuté pohľady; generátor preverí model ID/verziu, jedinečnosť step ID a platnosť všetkých krokových/vetvových odkazov vo workflowe a ostatných pohľadoch. Zastaraný workflow/manuál sa neoznačí ako aktuálny.

Pri vlastnom odbornom postupe má model väzbu na stabilné role ID a workflow cestu. Prevedenie existujúceho nemodelovaného SKILL postupu najprv zachová pôvodný obsah a vyžaduje potvrdenie významu; po prijatí nesmú zostať dve súbežne normatívne verzie. Register procesov/tímu sa odvodzuje z modelov/profilov, nevzniká ďalší ručne udržiavaný zoznam.

### HTML manuál dostupný hneď po inštalácii

`Manuál/index.html` je pripravený ľudský vstup s prehľadom procesov a odkazom na tím; `Manuál/tim.html` obsahuje mená/roly, zodpovednosti a väzby na procesy. Proces možno otvoriť ako čitateľný text a mapu s vlastníkmi, vstupmi, výstupmi a kontrolou. Prvý stav obsahuje Olivera a všetky tri štartovacie procesy; odborný tím a vlastné procesy môžu byť zatiaľ prázdne. Štartovacie systémové procesy a vlastné firemné procesy majú zrozumiteľné označenie v tom istom prehľade.

Vytvorenie/úprava zamestnanca alebo modelu obnoví dotknuté procesové stránky, prehľad procesov, tím/routing/adaptéry a vzájomné odkazy z aktuálnych vstupov. Vlastný tím/práca sa pritom neresetuje. Ak generovanie zlyhá, posledný platný výstup sa zachová, stav sa označí a vznikne konkrétny recovery krok; úloha nie je hotová iba vytvorením profilu/modelu. Platí existujúci offline kontrakt, pribalené assets, bezpečný renderer a prenosné odkazy. Návod Začnite tu odkazuje na úvod manuálu.

### Workshopová cesta

Tomáš môže hneď ukázať proces nastavenia, tvorby zamestnanca a tvorby postupu. Účastník najprv doplní kontext a priority do prepojených dokumentov; potom vyberie odbornú rolu, s Oliverom ju vytvorí, opíše jej jednu opakovanú činnosť a overí workflow na dvoch vstupoch. Záverečný nový chat nadviaže na profily, rozhodnutia, tabuľu a denné zápisky. Príprava marketingového zamestnanca môže používať všeobecný vzor alebo vlastný návrh; nevynucuje sa interný tím autora. Orientačných 45 minút na kontext je plánovací predpoklad po funkčnej inštalácii, nie overený čas setupu.

### Požadované generalizácie

- Konfigurácia názvu firmy/vaultu, autora a relatívnych koreňov; odstránenie mien, ciest, značky a procesových výnimiek pôvodnej firmy.
- Prehľad odvodený z modelov; prázdna nová firma je platná, bez povinného konkrétneho firemného Markdown registra.
- Role/vlastníci podľa stabilných ID z kanonických profilov; žiadne regex rozhodovanie podľa osobného mena zamestnanca.
- Validácia jedinečných ID, známych vlastníkov, cieľov vetiev, dosiahnuteľnosti a koncových výsledkov pred zápisom výstupov.
- Bez vykonávania kódu z modelov; bezpečné vykreslenie externého obsahu a kontrola cieľových ciest vrátane Windows a symlinkov.
- Manifest generovaných súborov, ochrana cudzieho obsahu a obnova pri chybe. Zastaralý výstup možno odstrániť len ako preukázateľne vlastnený.

Raw HTML z textových polí modelov sa escapuje; Markdown renderer nesmie vložiť ich HTML tokeny ako vykonateľný obsah. Mermaid používa `securityLevel: 'strict'`. Samotný Marked sanitizáciu nezabezpečuje; renderer musí mať vlastné overené escapovanie/sanitizáciu aj kontrolu URL. Negatívny test vloží `<script>`, event handler a `javascript:` odkaz: skript sa nespustí, nevznikne aktívny nebezpečný odkaz a obsah zostane bezpečne zobrazený alebo odmietnutý s dôvodom. [Marked](https://marked.js.org/), [Mermaid securityLevel](https://mermaid.js.org/config/schema-docs/config-properties-securitylevel.html)

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

Zápis: čomu sa práca venovala, výsledok a odkazy, potvrdené rozhodnutia, otvorené body/ďalší krok. Návrh sa neoznačí ako prijaté rozhodnutie. Zápis je heslovitý, bez raw chatu a tajomstiev; duplicita toho istého pracovného výsledku sa nedopíše pri retry. Deň bloku určuje lokálny dátum v používateľovom časovom pásme v čase jeho prvého zápisu. Session ukončená po polnoci zapisuje nový výsledok do nového dňa; staršie bloky sa nepresúvajú. Pred appendom vznikne stabilné ID výsledku, napr. `<!-- os:result:<uuid> -->`, uložené v pracovnom podklade; retry zachová ID aj pôvodný cieľový deň a overí jeho existenciu pred zápisom. ID je technická identita, nie hash premenlivého textu. Čisté rozhodnutie bez pracovného podkladu dostane ID v jeho autoritatívnom zázname. Readback overí deň, ID a zachovanie starších blokov.

Týždenný/mesačný prehľad vzniká na požiadanie z vybraného obdobia so zdrojovými odkazmi. Odlišuje vykonanú prácu, čakanie a návrhy. Neaktivuje automatický rozvrh, learning loop alebo zmenu policy. Firemné rozhodnutie patrí do `Prehľad firmy.md`; klientské alebo projektové do autoritatívneho dokumentu svojho subjektu. Úloha patrí na tabuľu, denný záznam uchová históriu a odkazy na tieto pôvodné záznamy. Žiadne automatické odhady času/fakturácia z denníka vo v1.

## 11. Skills a pripravené ukážky

Oliver pri konkrétnej činnosti načíta príslušný postup podľa tejto mapy. Jeho hlavný profil a AGENTS nesú triggery/pointery; kroky majú jednu kanoniku. Zdieľaný postup sa nekopíruje pod každú rolu. Nasledujúce cesty sú povinný obsah budúceho core balíka, nie tvrdenie, že už vznikli v tomto repozitári.

| Schopnosť / spúšťač | Kanonický obsah | Trieda a agentový vstup |
|---|---|---|
| Vysvetliť/nastaviť systém, pokračovať v onboardingu | `Procesy/system-nastavenie-firmy/model.yaml` | seeded; generated `AI OS/Tím/oliver/workflows/nastavenie-systemu/SKILL.md` |
| Vytvoriť zamestnanca | `Procesy/system-tvorba-zamestnanca/model.yaml` | seeded; generated `AI OS/Tím/oliver/workflows/tvorba-zamestnanca/SKILL.md` |
| Vytvoriť/upraviť SOP, obnoviť procesný manuál | `Procesy/system-tvorba-postupu/model.yaml` | seeded; generated `AI OS/Tím/oliver/workflows/tvorba-procesu/SKILL.md`; engine realizuje build |
| Pracovať s tabuľou, ID a pokračovaním | `AI OS/Postupy/pracovna-tabula.md` | package; živý stav iba v tabuli/detailoch podľa §6 |
| Uložiť/prepojiť výsledok, deduplikovať a obnoviť zápis | `AI OS/Postupy/ukladanie-a-deduplikacia.md` | package; odkazuje na schému a dva zápisové kontrakty §12 |
| Zachytiť nápad alebo spracovať Inbox | `AI OS/Postupy/inbox-a-napady.md` | package; používa firemný routing z Mapy |
| Zapísať denný trail alebo pripraviť súhrn | `AI OS/Postupy/denny-trail.md` | package; uplatní používateľovo nastavenie a §10 |
| Spracovať/prehľadať znalostnú bázu | `AI OS/Tím/oliver/workflows/sprava-znalostnej-bazy/SKILL.md` | package nemodelovaný workflow; Pravidlá znalostnej bázy naň odkazujú |
| Skontrolovať výsledok a hranice dôkazu | `AI OS/Postupy/kontrola-vysledku.md` | package; podľa rizika nezávislý verifier, bez novej povinnej roly |
| Validovať metadata a typy poznámok | `AI OS/Systém/Schémy/poznamka.schema.json` | package; validator a generated `AI OS/Systém/Návody/Metadáta.md` čítajú ten istý kontrakt |

Mapa systému drží firmou zvolený routing, preferencie a povolené rozšírenia. Spoločné návody odkazujú na autoritatívne profily/tabuľu/schémy; nevytvárajú druhý živý stav ani ďalšie editovateľné zoznamy procesových krokov.

Jednoduchá nezávislá kontrola porovná zadanie, zdroje a výsledok, s verdiktom PASS/PARTIAL/FAIL/UNKNOWN. Samostatný verifier môže byť voliteľnou rolou; ak je nutné nezávislé overenie, autor svojho výsledku sa nevydáva za nezávislého reviewera.

Pribalená ukážka spracovania zápisu zo stretnutia: fiktívny text → fakty/rozhodnutia/úlohy → ľudská kontrola → uložený výsledok. Funguje bez Gmailu, nahrávača alebo CRM; obsahuje dva vstupy. Ukážky sú označené a nedostanú sa medzi firemné potvrdené údaje.

Voliteľný Blog Writer prenesie jednoduché jadro používaného postupu: zdroje → osnova → potvrdenie → text → kontrola. Ukážka má vlastný priečinok a deklarované závislosti; aktivovaný odborný postup patrí príslušnému zamestnancovi. CMS a distribúcia obsahu vyžadujú osobitné nastavenie. Hlas firmy a zdroje sa doplnia; publikovanie nie je implicitnou časťou príkladu.

### Lokálne účastnícke materiály a kopírovanie

Po úspešnej plnej inštalácii otvorí účastník v Obsidiane `Začnite tu.md` → **Workshop: vlastný zamestnanec** → lokálny pracovný list, zvolenú ukážkovú vetvu a HTML manuál. Materiály sa neposielajú počas workshopu mailom. Pracovný list obsahuje P1 firemný základ, P2 odborný zamestnanec, P3 pracovný postup, P4 vstup A, P5 oprava, P6 vstup B v novom chate, P7 pokračovanie doma. Každý dlhý prompt je samostatný kopírovateľný textový blok, s názvom/kontrolným bodom a upozornením doplniť hranaté zátvorky. Živý stav sa nesleduje v čítačke, patrí tabuli. Pred P1 účastník vyberie vlastné vstupy alebo jednu demo vetvu; v P2 a P3 vytvorí zamestnanca a postup pre zvolenú oblasť. Voľbu nájde v úvode fragmentu aj portálu. Bez Obsidianu otvorí lokálny `Workshop/index.html` v prehliadači. P5 a P7 majú krátky viditeľný kontrolný bod mimo fenced promptu.

Ukážky sú tri voliteľné vetvy: marketing, inbox bez konektora a stretnutie. Každá obsahuje vlastný demo kontext, dva odlišné fiktívne vstupy A/B a kritériá výsledku. Označenie fiktívnosti je viditeľné aj súčasťou kopírovaného dema. Kombinovaná HTML akcia kopíruje označenie/izoláciu + kontext práve tej vetvy + presný zvolený vstup; celý kopírovaný text je viditeľný. Nevytvára skryté inštrukcie ani nemieša vetvy. Markdown umožňuje rovnaký výsledok ručne. Demo zadanie, oba vstupy, výsledky a pokračovanie sa ukladajú do `Ukážky/Workshop/<vetva>/`, kde `<vetva>` je stabilné `marketing`, `inbox` alebo `stretnutie`. Demo opravy sa ukladajú do sekcie Demo opravy v zadanie.md; tabuľa a denný zápis nesú len odkaz označený ako fiktívna ukážka. Pred skúškou B agent z toho istého miesta načíta zadanie.md vrátane opráv a výsledok A; nový chat nemusí hádať umiestnenie. Demo údaje neprepisujú `Prehľad firmy.md`, `O mne.md`, potvrdené priority/rozhodnutia ani reálny profil, model alebo postup zamestnanca. Mená, lokalita, dátumy a obmedzenia demo firmy ostávajú v demo zadaní. Pri P5 možno po potvrdení preniesť iba všeobecnú znovupoužiteľnú zásadu; konkrétne demo fakty a obmedzenia sa neukladajú ako firemné pravidlo. Vlastné reálne pravidlo môže používateľ výslovne určiť na základe svojho firemného kontextu. Duplicitný HQ sa nezakladá.

HTML používa lokálne assets, natívne tlačidlá, viditeľný focus a prístupné hlásenie stavu. Skopírované oznámi až po úspechu clipboard operácie. Pri odmietnutí/absencii API označí presný blok a ponúkne Ctrl/Cmd+C bez falošného úspechu. Bez JavaScriptu je celý text čitateľný/označiteľný. Overiť diakritiku, nové riadky, klávesnicu, 320px/200% zoom, success aj failure. Zhoda sa meria v skutočne vloženom texte AI klienta alebo v samostatne označenom kontrolnom textovom zachytení. Report zachová raw UTF-8 bajty, OS/aplikáciu/meraný povrch, počty LF/CRLF a výsledok byte porovnania pre všetkých 13 blokov. Povolené je vynechanie jediného posledného LF cieľovým editorom. Na Windowse môže systémová schránka zmeniť LF na CRLF; iba pri pozorovanej a zaznamenanej zmene sa pre porovnanie vykoná presná inverzia CRLF → LF, ktorá musí obnoviť pôvodné bajty (prípadne s uvedenou koncovou LF odchýlkou). Raw výsledok a porovnanie po tejto inverzii sú oddelené. Táto výnimka sa neprenáša na Mac bez dôkazu. Žiadny všeobecný trim ani zmena medzier/diakritiky či iných riadkov nie sú dovolené. Ide o kontrakt clipboard testu, nie o zmenu hashovania súborov alebo release archívu, ani o dôkaz skutočného Windows runtime. Konkrétne Obsidian tlačidlo/režim a správanie file:// sa negarantujú bez skúšky; Markdown fallback je súčasť návodu.

### Kanonika, export a hranica obsahového modulu

Obsah vzniká z dvoch autoritatívnych účastníckych podkladov. Release nesie deterministické sanitizované snapshoty a provenance s logickými source ID/hashmi, bez absolútnych súkromných ciest. Snapshoty sa neupravujú ako druhá nezávislá redakčná verzia; aktualizácia ide zo zdroja cez explicitný export a diff. HTML/Markdown sú odvodené pohľady. Distribuované Markdown podklady majú verejné metadata podľa §12 a vzájomné existujúce relatívne odkazy pod H1; súkromné metadata sa neprenášajú. Fragment zdedí metadata koreňového Začnite tu pri integrácii. Export zachová presné texty siedmich promptov a šiestich raw vstupov aktuálnej kanonickej revízie; schválená obsahová oprava ide najprv do zdroja a potom obnoví provenance/export s dohľadateľným diffom. Vo v1.7 sa prompty P1–P7 nemenia. Export odstráni interný frontmatter, vaultové wiki-linky, distribučné/lektorove režijné poznámky a premení kritériá na účastnícke označenie. Interný lektorský scenár sa nedistribuuje. Zostavenie z pribalených snapshotov musí fungovať bez súkromného vaultu a siete.

Obsahový modul sa vytvára v čistom/staged výstupe; nesmie prepísať používateľský workspace. Opakované zostavenie je deterministické, existujúci cudzí/neznámy obsah má konflikt, pri obnove sa zachová. Budúci plný inštalátor materiály začlení ako package/generated obsah a do seeded Začnite tu vloží spravovaný blok iba pri prvom vytvorení alebo potvrdenej migrácii. Existujúcu personalizáciu/checkboxy neprepisuje. Jadro inštalátora nahradí nezobrazený integračný marker vo fragmente a portáli aktívnym odkazom na skutočný overený manuál; technické integračné vety sa účastníkovi nezobrazujú. Verify plnej integrácie odmietne nevyriešený marker alebo mŕtvy cieľ. Samostatný modul manuál nevytvára. Core spolu s `Workshop/` prenesie a overí aj koreňový `workshop-component-manifest.json`; relatívna referencia `../workshop-component-manifest.json` v source metadátach Workshop poznámok musí zostať funkčná. Po nahradení integračných markerov jadro zachová sourceProvenance, obnoví hashe a zoznam skutočne prenesených generated výstupov v komponentovom manifeste a až potom vykoná verify/installed ownership. Konzumovaný fragment, ktorý sa neprenáša ako samostatný súbor, sa zo zoznamu komponentových výstupov vyradí; koreňový Začnite tu zostáva seeded dokumentom evidovaným v installed ownership. Tento komponentový manifest je generated obsahová evidencia, nie náhrada release manifestu ani installed ownership stavu. Build modulu, runtime čítačky, Obsidian a čistý používateľský pilot sú samostatné dôkazy; hotový modul neznamená hotový celý inštalátor.

## 12. Metadáta, zápisy a technické adaptéry

`AI OS/Systém/Schémy/poznamka.schema.json` je jediný balíkový základ metadát; obsahuje aj popisy polí a mapovanie distribuovaných šablón. Validator ho načíta, neudržiava druhý enum v kóde. Návod Metadáta sa generuje zo schémy. `Mapa systému.md` vlastní firemný routing a dovolené rozšírenia, odkazuje na balíkový základ. `Znalostná báza/Pravidlá.md` dopĺňa spracovanie zdrojov; LLM Wiki nie je schéma celého OS.

### Metadata a prepájanie

Každá nová alebo agentom vytvorená pracovná Markdown poznámka vrátane seeded profilov, tabule a denných zápiskov má YAML frontmatter:

| Pole | Typ a pravidlo |
|---|---|
| `type` | String zo základného enumu `identity`, `company`, `map`, `board`, `guide`, `tool`, `preparation`, `note`, `daily`, `client`, `project`, `index`, `knowledge`, `idea`, `log`; ďalšie typy len cez deklarované rozšírenia nižšie. |
| `status` | String `draft`, `active` alebo `archived`; stav dokumentu nie je schválenie výsledku ani stav úlohy. |
| `created`, `updated` | Properties dátum ISO `YYYY-MM-DD`; čas udalosti v tele môže byť ISO s časovým pásmom. |
| `owner` | String s potvrdeným vlastníkom; pred určením `neurčený`. |
| `source` | String s URL, cestou alebo opisom skutočného pôvodu; pri chýbajúcom zdroji `nezistené`. |
| `ai-generated` | Boolean; `true` ak text vytvoril agent. AI pôvod neznamená prijatie obsahu. |
| `tags` | YAML zoznam stringov; pri AI texte obsahuje `🤖`, ďalšie podľa typu. |
| `project`, `client` | Voliteľné stringové identifikátory/odkazy; iba keď sa poznámka týka konkrétneho subjektu. |

**Priradenie šablón:** O mne→`identity`; Prehľad firmy→`company`; Mapa systému→`map`; Pracovná tabuľa→`board`; Začnite tu, Inbox README, procesový postup.md, `AI OS/Postupy/*.md`, `Znalostná báza/Pravidlá.md` a `AI OS/Systém/Návody/Metadáta.md`→`guide`; Nástroje→`tool`; procesová Príprava→`preparation`; pracovný dokument a účastnícke Workshop Markdown podklady→`note`; fiktívne pracovné dokumenty v `Ukážky/`→`note` s tagom `ukazka`; denný súbor→`daily`; _klient→`client`; projektový kontext→`project`; tímový/znalostný index a rozcestník→`index`; spracovaný poznatok→`knowledge`; nápad→`idea`; appendový znalostný log→`log`. Technické súbory a originály majú výnimky uvedené nižšie, bez vynútenia note YAML.

**Rozšírenia firmy:** jediná deklarácia je frontmatter Mapy: `company-os-extra-types` (zoznam nových ID s prefixom `custom-`) a `company-os-extra-fields` (mapa `custom-<id>` na typ `string`, `boolean`, `number`, `date` alebo `string-list`). Rozšírenia môžu pridať typ/pole, nemenia význam základných typov, povinné polia, ISO dátumy, ochranu originálov ani bezpečnostné brány. Effective validator najprv overí deklaráciu podľa balíkovej schémy, potom spojí základ s týmito rozšíreniami. Neznámy typ/pole alebo neplatná deklarácia má checkpoint; obsah sa automaticky nezmaže ani nepreklasifikuje. Základná schéma sa aktualizuje v package, rozšírenia sa zachovajú; nekompatibilná zmena vyžaduje plán a potvrdenú migráciu. Ďalšie základné systémové polia, napr. `sources`/`certainty` a uvedené deklarácie, sú výslovne súčasťou tej istej schémy.

Znalostný poznatok pridáva `sources` ako zoznam existujúcich zdrojov a `certainty` ako `confirmed`, `partial` alebo `unknown`, s vysvetlením v tele. Denný filename je `YYYY-MM-DD.md`. Ľudské zobrazenie môže byť lokalizované. [Obsidian — Properties](https://obsidian.md/help/properties)

Pod H1 je `> **Súvisí s:**` s relevantným nadradeným kontextom a súvisiacimi dokumentmi, najviac päť odkazov. Pri založení sa doplní príslušný index/nadradený dokument a pri sesterských pracovných dokumentoch aj spätný odkaz. Odkazy majú existovať; budúci cieľ sa označí textom, nie predstieraným funkčným linkom. Pri všetkých opakovateľných názvoch (napr. SKILL, index, postup, Príprava, model.yaml, _klient a log) majú agentové/wiki odkazy plnú cestu od overeného rootu. Relatívny Markdown/HTML odkaz je prípustný v odvodenom pohľade s explicitným základom a overeným cieľom; nemožno ho vyhodnocovať podľa náhodného aktuálneho priečinka chatu. Generovaný index sa obnovuje zo svojich vstupov, neupravuje sa ručne. Ak index ešte neexistuje, založí sa najmenší potrebný podľa pravidiel oblasti. Súbory sa neprepájajú mechanicky so všetkými ostatnými.

Originálne importované súbory vrátane Markdown zdrojov sa kvôli metadátam či spätným odkazom nemenia. PDF, obrázky, audio a raw podklady majú sprievodnú poznámku alebo záznam v indexe s metadátami, pôvodom a odkazmi. `SKILL.md` dodrží Agent Skills frontmatter (`name`, `description`, doplnky v `metadata`); workflow má `metadata.kind: workflow`, rolový profil `metadata.kind: role`. Poznámkové doplnky v skill metadata sú stringy podľa formátu. Procesový model, adaptéry, AGENTS/import, skripty a generované HTML používajú vlastnú schému a explicitné cesty/manifest, nie vynútený poznámkový YAML. Generované pracovné Markdown pohľady používajú poznámkovú schému odvodenú z modelu/profilu. Každý formát má určenú kanoniku a navigovateľné väzby.

### Dva kontrakty zápisu

**Prvá inštalácia hotových súborov:** agent použije dostupné natívne nástroje podľa §13; Node nie je prerekvizita účastníka. Manifest a súbory overí pred zápisom, cieľ je prázdny a existujúce dáta neprepisuje. **Budúce systémové aktualizácie/generovanie:** potrebujú vlastný overený zapisovač a konkrétny plán; voľba jeho runtime nesmie spätne podmieniť základnú inštaláciu. Pred zápisom porovná SHA-256 presných aktuálnych bajtov s baseline návrhu. Zmena vyvolá nový plán alebo konflikt; nepoužije pripravený prepis. Použije dočasný súbor na rovnakom filesystéme, podporovanú atomickú náhradu jednotlivého súboru, zálohu/journal a readback. Lokálna ochrana koordinuje našich vykonávateľov; nejde o distribuovaný lock ani atomickú výmenu celého releasu.

**Bežná práca agenta:** aktuálny dokument načíta tesne pred úpravou v tej istej pracovnej operácii; použije cielený patch s jednoznačným kontextom alebo append nového bloku. Existujúci seeded/user Markdown celý neprepisuje nástrojom Write. Pri zmene kontextu/zlyhanom patchi znovu číta a zlučuje iba vlastnú úpravu; kolíziu ukáže na rozhodnutie. Po zápise vykoná readback a kontrolu metadát, ID a odkazov. Nový dokument môže vytvoriť až po overení, že cesta neobsahuje cudzí obsah. Významný prepis má konkrétny plán a obnoviteľnú zálohu. Takáto editácia nezaručuje byte-hash CAS ani spoluprácu súbežného externého editora. [Claude — Edit/Write](https://code.claude.com/docs/en/tools-reference)

### Synchronizácia a jeden zapisovateľ

Na začiatku session a pred zápisom do synchronizovaného priečinka preveriť dostupný stav úložiska a oznámenú zmenu zariadenia. Pozorovateľné signály na zastavenie dotknutého zápisu: konfliktná kópia podľa rozpoznaného poskytovateľa, online-only placeholder alebo nečitateľný obsah, hlásená chyba/pozastavenie synchronizácie, zmena dotknutého súboru po načítaní alebo oznámený prechod na druhé zariadenie bez potvrdenia sync. Lokálnu zmenu možno znovu načítať a zosúladiť; konfliktnú kópiu nemožno automaticky zahodiť. Čas zmeny sám osebe nedokazuje konflikt ani aktuálnosť cloudu. Detekcia placeholderov a konfliktov je provider/platform test, nie predpoklad spoločného API.

Pri prechode zariadenia si používateľ overí dokončenú synchronizáciu v UI poskytovateľa; agent zaznamená jeho potvrdenie a čas do lokálnej evidencie daného zariadenia a znovu načíta dotknuté dokumenty. Bez dostupného dôkazu pracuje s nimi read-only; nezávislé čítanie môže pokračovať. Potvrdenie je používateľský dôkaz, nie automatická vzdialená verifikácia.

Jeden pracovný objekt má jedného aktívneho zapisovateľa, agentové zápisy sú sekvenčné. Človek môže tabuľu upraviť v Obsidiane; ďalší agentový krok číta aktuálny obsah. **Lokálny hash nedokazuje aktuálnosť cloudu ani iného zariadenia.** Originály a archívy majú checksum z presných bajtov, nové generované texty UTF-8/LF. LF/NFC porovnanie je iba pomocné; nemení originál ani samo neautorizuje update. Normalizácia názvov deteguje kolízie, neprepisuje automaticky existujúce mená.

### Vyvolávanie a platformové cesty

| Povrch | Kontrakt v1.8 |
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

Read-only preflight porovná dostupné osobné/globálne/project ID, najmä `~/.claude/skills/` a `~/.agents/skills/`, a všetky relevantné nadradené `.claude/skills/`/`.agents/skills/` na skutočnej discovery ceste klienta, vrátane dostupných enterprise vrstiev. Nedostupnú vrstvu označí UNKNOWN. Rozsah klientovej discovery je verzovaný údaj, nie domnienka z existencie adresára.

**Dôkaz vyvolania:** generated wrapper nesie verejnú technickú značku s verziou balíka, `workspace_id`, stabilným role ID, explicitným cieľovým profilom a jeho build hashom. Pri explicitnej skúške v novej session agent vráti túto identitu a načítaný profil; tester zaznamená použitý natívny príkaz/výber a UI/klientský výsledok, prípadne zdrojový trace, ak ho klient poskytuje. Porovná ju s aktuálnym manifestom a malým overovacím zadaním z profilu. Source verify overí súbory/hashe, samo nevidí reálne vyvolaný skill. Samotné menu meno alebo opísaná značka z disku nenahrádzajú runtime dôkaz; pri nedostatočnom dôkaze zostáva vyvolanie UNKNOWN.

**Kolízia osobného ID:** `/oliver` alebo rovnaký natívny selector sa neoznačí za správny, kým neprejde skúškou. Default recovery bez zmeny cudzieho configu je prirodzené zadanie s explicitným overeným rootom → indexom tímu → kanonickým profilom; výsledok sa vykáže ako tento fallback, nie natívne vyvolanie. Používateľ môže osobný skill vedome premenovať/vypnúť a zopakovať test; agent ho automaticky nemení. [Claude — Name precedence](https://code.claude.com/docs/en/skills#resolve-skills-that-share-a-name)

Pri Claude štarte v podpriečinku môže import rootového AGENTS viesť mimo pracovného priečinka a vyžiadať súhlas. Recovery vysvetlí, že zamietnutý import môže zostať vypnutý bez opakovaného dialógu; návrat do rootu a nové načítanie sa musia overiť, cudzia konfigurácia sa neprepisuje. [Claude — Imports](https://code.claude.com/docs/en/memory)

AGENTS cieľ najviac 8 KiB neznamená garantované miesto v globálnej reťazi. Preflight/verify preverí aktívne override/nadradené pokyny, reálny byte rozsah a úplnosť načítania. Codex default limit 32 KiB sa týka kombinovaných pokynov; nový chat musí preukázať správne načítanie, nie len citovať pripravený súbor.

## 13. Inštalácia hotových súborov a životný cyklus

### Používateľská cesta cez chat — prijaté vo v1.8

1. Používateľ vytvorí prázdny priečinok, napríklad v Dokumentoch, a otvorí ho ako projekt v lokálnom Codexe alebo Claude Code. Má funkčné prihlásenie a prístup k priečinku. Bežný webový chat bez lokálnych súborových nástrojov túto inštaláciu nevykoná.
2. Vloží krátky prompt z README repozitára. Agent prečíta INSTALL, zistí a zaznamená konkrétny GitHub commit a ďalej používa iba obsah tohto commitu. Používateľ nemusí pracovať s terminálom ani inštalovať Node, Git, Python či ďalšieho správcu balíkov.
3. Agent overí skutočný koreň, oprávnenia, relevantné nadradené pokyny, existujúci obsah, kolízie ciest a lokálnu čitateľnosť. Existujúci spravovaný priestor sa iba skontroluje; cudzí, starší alebo neúplný stav má checkpoint bez resetu.
4. Hotové súbory `starter/` stiahne do dočasného priestoru dostupnými nástrojmi klienta/OS. Overí relatívne cesty, unikátnosť inventára, veľkosti a SHA-256 presných bajtov. Súbory sú údaje a pokyny pre agenta; žiadny stiahnutý program, shell skript ani runtime sa nespúšťa. Nedostupná sieť alebo natívny nástroj má konkrétne vysvetlenie, nie automatickú inštaláciu závislostí.
5. Pred kopírovaním znovu preverí prázdny cieľ a plán. Použije vytváranie bez prepísania, vykoná readback všetkých prevzatých súborov a uloží marker `.os-starter/` s verziou a zdrojom. Zlyhanie uprostred sa označí ako neúplná inštalácia; ďalší beh nesmie taký stav označiť za hotový ani ho automaticky opraviť. Prerušený kopírovací krok nemá sľub viac-súborovej atomicity.
6. Voliteľný cloudový krok podľa nasledujúcej časti neblokuje lokálny štart. Po kontrole agent otvorí Začnite tu a vedie používateľa jednou otázkou z pracovnej tabule. Nový chat z koreňa reálne preukáže, že načítal uložené pravidlá a kontext.

Inštalačný prompt je krátky vstup; podrobný vykonávací postup zostáva v INSTALL a hotový obsah v `starter/`. Zdroj tvorí existujúci model/schéma/šablóny. Správca ho zostavuje a testuje cez Node, účastník preberá už zostavený výsledok. Meniteľný `main` slúži na nájdenie aktuálneho commitu, samotné prevzatie je viazané na jeho 40-znakový identifikátor. Pri opakovaní už nainštalovanej verzie sa nepreberá potichu nová verzia.

### Voliteľná synchronizácia a zálohovanie

Agent ponúkne dve možnosti: **pokračovať v otvorenom lokálnom priečinku** alebo **použiť už nastavený OneDrive, Dropbox či Google Drive s lokálne dostupnými súbormi**. Predvolená bezpečná cesta je pokračovať lokálne. Návod vysvetlí, že Dokumenty samy osebe nepotvrdzujú cloudové zálohovanie.

Ak cloud nie je nastavený, inštalácia pokračuje a na jedinej pracovnej tabuli zostane stabilná úloha **Nastaviť synchronizáciu a zálohovanie**, s odkazom na príslušný návod. Retry ju nevytvára znova. Ak používateľ už cloud používa, overí lokálnu/offline dostupnosť, dokončený stav synchronizácie v UI poskytovateľa a možnosti obnovy/verziovania. Samotná cloudová cesta ani zhodný hash neznamenajú dokončený sync alebo zálohu; jednotlivé nepotvrdené podmienky zostávajú otvorené.

Agent automaticky neprihlasuje cloudový účet, nenastavuje poskytovateľa a nepresúva hotový workspace. Voľba iného koreňa potrebuje konkrétnu používateľskú voľbu a otvorenie správneho priečinka. Presun už naplneného priestoru je samostatný plán. Pred pokračovaním na druhom zariadení sa znovu preverí lokálna dostupnosť a používateľ potvrdí dokončenú synchronizáciu; staré potvrdenie v zdieľanom dokumente nie je aktuálny dôkaz. Synchronizácia prenáša aj zmazanie; nezávislá obnova/verziovanie sa posúdia samostatne.

### Pôvod, integrita a oprávnenia

Účastník dôveruje konkrétnemu repozitáru `tomasmartincok/company-os` a pokynu organizátora. Konkrétny commit fixuje zdroj, manifest kontroluje úplnosť a presné bajty. Manifest stiahnutý z toho istého zdroja nie je nezávislý kryptografický podpis autora. Organizátor môže pre riadený workshop odovzdať aj presný commit/pin; chýbajúci taký pin nevyvolá sťahovanie alebo spúšťanie programu.

Agent použije dostupné natívne HTTP/hash/súborové nástroje a bezpečné argumenty podľa skutočného OS a shellu. Hodnoty ciest sú dáta; žiadne eval/download-pipe-shell. Cieľové scenáre sú macOS a Windows, medzery a diakritika; skutočný platformový výsledok sa vykáže osobitne. Nepotrebuje inštalovať GPG ani meniť PATH, execution policy, globálne AI nastavenia či režim full access. Managed zamietnutie má checkpoint. Klient/OS môžu vyžiadať vlastné schválenie siete alebo priečinka; počet dialógov sa negarantuje.

Historická Fáza 0 s archívom a pinovaným Node z `0.1.0-core.1` zostáva reprodukovateľným starším vydaním. Nie je predvolenou inštaláciou v1.8. Jej návod/podpisový dôkaz nepredstavuje závislosť nového účastníka. Automatická migrácia z historického manifestu sa v jednoduchom vydaní nevykonáva.

### Vlastníctvo súborov a budúci update

| Trieda | Význam | Príklady | Aktualizácia |
|---|---|---|---|
| `package` | Balík vlastní systémový obsah | AGENTS, import CLAUDE, generátory, default systémové návody | Nahradiť len vlastnený nezmenený súbor po pláne; pri lokálnej zmene diff/rozhodnutie. |
| `generated` | Odvodené z aktuálnej kanoniky | Adaptéry, index tímu, text/mapy/HTML a modelové workflow SKILL pohľady | Regenerovať z profilu/modelu; odstrániť len preukázateľne vlastnený zastaraný výstup. |
| `seeded` | Balík založí prvú verziu, potom ju vlastní používateľ | Oliver, tri štartovacie modely, Mapa systému, pracovná tabuľa, firma/O mne | Druhý setup ponechá; update iba diff a konkrétne potvrdenie migrácie. |
| `user` | Skutočné podklady a práca používateľa | Denné zápisky, zdroje, vlastné profily/modely a výstupy | Žiadny automatický reset/update/mazanie. Povolená bežná práca agenta podľa zadania zostáva možná. |

Počiatočný jednoduchý marker eviduje konkrétnu verziu, zdrojový commit a inventár baseline; presné polia definuje implementačný manifest. Nasledujúci rozšírený update kontrakt je požiadavka ďalšej etapy, nie implementovaná schopnosť jednoduchého setupu. Rozšírený manifest eviduje `workspace_id`, jednu `installed_version`, cestu, triedu, verziu schémy, presný posledný vlastnený byte hash a odvodené vstupy. Per-device checkpointy a verify stav nie sú súčasťou zdieľaného manifestu. Seeded súbor sa po vytvorení nezmení na package len preto, že má starý template marker. `Mapa systému.md` môže mať balíkovú počiatočnú štruktúru, no ďalšiu úpravu vlastní firma. Vlastné pravidlá patria tam; ak používateľ zmení AGENTS priamo, update ich tiež zachová a ukáže konflikt.

Rovnaký setup nevytvorí duplicity, nezruší checkboxy a nezopakuje hotový onboarding. Pri update uviesť pin/changelog/diff a pred prepisom overenú zálohu. Automatický downgrade sa nevykoná; zámerný rollback použije preverený recovery plán. Migrácie schémy vo v1 len podľa konkrétneho plánu a potvrdenia, bez skrytého hromadného prepisu. Update pripraví celý release v stagingu, vypočíta plán, preverí odkazy seeded profilov na package workflowy a vyrieši všetky konflikty pred apply. Pri nevyriešenom konflikte aktívne súbory a installed_version zostávajú na predchádzajúcej verzii.

Pred prvým aktívnym prepisom apply pripraví overenú zálohu dotknutých súborov v súkromnom workspace `.os-starter/recovery/<transaction-id>/` s relatívnym inventárom a presnými hashmi; publikovaný release tieto používateľské zálohy neobsahuje. Do `.os-starter/update.json` uloží zdieľaný transakčný záznam (`transaction_id`, stav `pending`, baseline/target verzie a manifestové hashe, plán a referencia na zálohu). Zápis vykonáva iba aktívny apply/recovery. Lokálny journal v per-device evidencii dopĺňa poradie skutočne vykonaných zmien; nemení tým autoritu zdieľaného záznamu.

installed_version sa zmení až po overení všetkých výstupov; posledný transakčný záznam sa označí `committed` a zachová pre diagnostiku. Zlyhanie ponechá `pending`/`recovery-needed`. Ak zápis/verify zlyhá uprostred, journal označí nedokončený update, bežná systémová práca sa zastaví a recovery obnoví predchádzajúce vlastnené súbory alebo dokončí potvrdený plán. Overenie neoznačí zmiešaný stav ako platnú starú/novú verziu.

Zariadenie bez pôvodného lokálneho journalu tiež číta zdieľaný transakčný záznam. Pending/recovery-needed blokuje bežné systémové mutácie; recovery overí inventár a hash každej potrebnej zálohy a použije potvrdený plán, prípadne pokračuje na pôvodnom zariadení. Nedostupná/nesynchronizovaná záloha sa nevymýšľa. Rozpor verzie, manifestu a package/generated výstupov má checkpoint zmiešaného stavu, neoznačí sa automaticky za používateľskú úpravu. Samotný marker negarantuje poradie cloudového prenosu ani vzdialenú aktuálnosť; aj committed stav potrebuje lokálnu konzistenciu a pri prechode potvrdený sync podľa §12. Nejde o záruku atomickej výmeny viacerých súborov; sync režim vyžaduje jedného zapisovateľa a dokončenie/obnovu pred prechodom zariadenia. Odstránenie alebo odinštalovanie sa týka iba známeho vlastneného systému; súkromné údaje sa nevymažú.

Súkromný workspace nemá automatický public remote/push. Git nie je default; voliteľná súkromná história nesmie byť prerekvizitou workshopu.

## 14. macOS, Windows a úložiská

Cieľ je macOS a Windows s Codexom aj Claude Code. Účastník vyberie plnú cestu; nevynucuje sa meno používateľa alebo cloud autora. Lokálny priečinok, Dropbox, OneDrive a Google Drive sú cieľové scenáre. Pred workshopom zistiť používané OS/architektúry/klientov/úložiská a prioritne otestovať ich kombinácie; neoverenú kombináciu označiť UNKNOWN, neodstrániť ju ticho z cieľového zadania ani sľubovať podporu.

Preflight overí Windows x64/ARM64 a macOS Intel/Apple Silicon podľa dostupných nástrojov klienta/OS, cestu a bezpečné názvy, lokálnu/offline dostupnosť, miesto a oprávnenia. Dlhé cesty vrátane OneDrive otestovať na konkrétnom systéme; limit závisí od OS/nástrojov/nastavení. Pri prekročení podporovaného limitu navrhnúť kratší root, nie tichú zmenu mena či globálneho nastavenia. Prenos UTF-8 bajtov je explicitný, žiadny predpoklad správnej implicitnej ANSI interpretácie PowerShellu 5.1.

Testovať medzery, diakritiku/NFC/NFD kolízie, CRLF, rezervované Windows názvy, symlinky, file locks, otvorený Obsidian súbor, sync konflikty/on-demand súbory, presun rootu a výzvy macOS na prístup. Existujúce názvy sa automaticky nenormalizujú; kolízia má checkpoint. Online-only placeholder alebo webový cloud odkaz nie je funkčný root. Účastník má návod na „ponechať na zariadení“ podľa poskytovateľa. Dočasné technické súbory a tajomstvá zostávajú mimo sync; sync sám osebe nie je nezávislá záloha.

Adaptéry a dokumenty používajú relatívne odkazy. Na druhom zariadení znova overiť lokálne súborové nástroje/oprávnenia a synchronizáciu, neprepísať shared config absolútnou cestou prvého počítača. Celý manuál s assets sa prenáša spolu.

Pri používaní Obsidianu sa otvorí overený koreň `<Názov firmy> OS/` ako samostatný trezor; plné wiki cesty sa vyhodnocujú od tohto koreňa. Vnorenie company-os do iného trezoru nie je podporované bez osobitného overenia/routingu. Nadradený `.obsidian/` je preflight signál na objasnenie zvoleného trezoru, nie dôkaz, ktorý trezor je práve otvorený; dá checkpoint a ponúkne otvorenie OS rootu ako samostatného trezoru. Samotný marker neblokuje prácu používateľa, ktorý Obsidian nepoužíva. UI/lint skúška koreňového trezoru musí mať 0 nevyriešených deklarovaných odkazov.

Obsidian je voliteľný pohľad nad tým istým priečinkom; Markdown checkboxy nepotrebujú pluginy. Osobné workspace nastavenia autora sa nepribaľujú. Základná práca a manuál fungujú bez Obsidianu.

## 15. Obsah distribučného repozitára

Aktuálny distribučný vstup je README s krátkym promptom, `INSTALL.md`, hotový priečinok `starter/` s `manifest.json` a maintainer build/kontroly. Šablóny a model sú zdrojom generovaného startera; účastník tieto build skripty nespúšťa. Historická `templates/pokyn-fazy-0.template.md`, `pokyn-instalacie.txt` a legacy runtime sú zachované pre prvé vydanie, bez povinnosti novej inštalácie. Celý cieľový systém neskôr doplní Oliverove workflowy, generátor adaptérov/procesov, reader assets, ukážky, changelog a licencie/notices skutočne distribuovaných závislostí. Súkromné podklady a prevádzková evidencia autora sa do balíka neprenášajú.

Pred verejným prenosom overiť vlastnú licenciu a redistribučné podmienky bundled js-yaml/Mermaid/Marked a zachovať notices. Public obsah neobsahuje súkromné cesty, klientov, ERP IDs, kontakty, osobné testy, prístupy, MCP konfigurácie ani súkromné cloudové odkazy. Príklady sú fiktívne, nie len premenované reálne klientské dáta. Šablóna a pracovný priestor účastníka sa nesynchronizujú cez spoločný public GitHub.

## 16. Akceptačné kritériá a dôkazy

Tieto kritériá sú požadovaným dôkazom celého systému. Typy: **S** = source/unit/readback, **U** = skutočný UI/klientský discovery, reader alebo testerom riadený scenár správania agenta v reálnom AI klientovi (napr. retry/polnoc, neplatné ID alebo vložený pokyn v zdroji), **P** = čistý platformový/používateľský pilot. Jeden typ ani komponentový PASS nenahrádzajú ostatné; report označí každý vykonaný rozsah samostatne. Táto dokumentová revízia nevykazuje celý systém ako overený.

| ID | Scenár | PASS znamená | Dôkaz |
|---|---|---|---|
| AC-01 | Nová inštalácia cez chat | Netechnický účastník dokončí cez chat/UI bez vlastných terminálových príkazov a povinného Node/Gitu/Pythonu; uložený manifest zodpovedá skutočným súborom. Nainštalované sú tri štartovacie modely, ich postupy/mapy/agentové workflowy a HTML manuál s Oliverom; nie iba prázdny generátor. | P |
| AC-02 | OS a AI klienti | Praktický flow macOS+Codex, macOS+Claude Code, Windows+Codex, Windows+Claude Code; fresh načítanie z koreňa. Podpriečinok bez Gitu je osobitný výsledok: zaznamenať správanie a overiť návrat do rootu, nevyžadovať predstieraný úspech podpriečinkového štartu. Claude externý import má zachytený súhlas aj zamietnutie/recovery; po návrate do rootu sa načítanie overí. | U, P |
| AC-03 | Úložiská a presun | Deklarované lokálne/cloudové kombinácie, medzery/diakritika a presun rootu fungujú. Neoverená kombinácia je UNKNOWN, Mac-only výsledok ju nezastrešuje. | S, P |
| AC-04 | Opakovaný setup | Žiadne duplicity, reset onboardingu alebo zmeny seeded/user súborov; personalizácia aj checkboxy zostávajú zachované. | S, P |
| AC-05 | Upgrade a recovery | Staging a vyriešené konflikty pred apply, zachovanie local package/seeded úprav a cudzích configov. Jedna installed_version až po verify; simulované zlyhanie uprostred má zdieľanú pending transakciu, overenú zálohu a lokálny journal; zariadenie B bez journalu rozpozná recovery, zmiešaný stav nie je PASS. Odkazy seeded profilov na package workflowy platné; bez automatického downgradu. | S, P |
| AC-06 | Oliver a vyvolanie | Inline Oliver zachová dialóg, nový chat načíta projektovú kanoniku. Rename mení alias, nie ID/príkaz. Kolízia s osobným skillom je odhalená; source verify overí značku/hashe a U skúška zachytí skutočné vyvolanie, identitu wrappera/root/verziu/profil podľa §12. Selector má dôkaz alebo pravdivý fallback. | S, U |
| AC-07 | Nový zamestnanec | Rolový priečinok, interný workflow, index, adaptéry a HTML majú jednu kanoniku. Workflow nie je nový zamestnanec/príkaz; výsledok sa uloží pri subjekte. Metadáta/rename/trust stav overené; subagent len s povoleným delegovaním, nedostupná discovery vrstva UNKNOWN. Pridanie odbornej roly obnoví tím a väzby v manuáli; pôvodné modely a personalizácia zostanú zachované. | S, U, P |
| AC-08 | Proces a manuál | Model generuje významovo rovnaký text/mapu; invalid vetvy/owner zastavia build. Offline Chrome/Edge/Safari: text bez JS, mapa s JS. Raw HTML/script/event handler/nebezpečný URL sa nevykonajú, Mermaid strict; register bez vlastných procesov a fiktívna ukážka platné. V čistej inštalácii sa dajú otvoriť všetky tri štartovacie texty/mapy aj Oliverove zodpovednosti. Editácia modelu obnoví konzistentný agentový workflow a HTML; nezhoda verzie/ID blokuje označenie aktuálnosti. | S, U, P |
| AC-09 | Trvalé pokračovanie | Všetky úlohy a aktuálne otázky dokončenia na jednej tabuli so stabilnými ID; osobný/firemný profil má pripravené sekcie. Odpovede v profiloch/detaile, stav/vlastník/jediný krok na tabuli. Nový chat nadviaže; zmena textu/checkboxu v Obsidiane aj prerušený proces sú rešpektované. Vyriešené otázky majú odkaz; chýbajúce/duplicitné/neznáme/neplatné ID spustí konkrétnu recovery bez tichého re-seedu. Oliver vedie reálny rozhovor podľa príslušného modelu, ukladá kontext/priority a nový chat pokračuje od uloženého kroku. | S, U, P |
| AC-10 | Znalostná báza | Ingest zachová presné originály, aktualizuje poznatky/index/log a príslušné prepojenia; nové pracovné poznámky prejdú základnou/rozšírenou schémou, majú aspoň jeden relevantný existujúci odkaz v Súvisí s a záznam v príslušnom indexe; kontrolované odkazy majú 0 mŕtvych cieľov. Binárne/raw zdroje majú index/sidecar bez zásahu do originálu. Query uvedie zdroje/neistotu; lint read-only odhalí duplicitu/mŕtvy odkaz. | S, U, P |
| AC-11 | Denný trail | Lokálny dátum pri prvom zápise, append dvoch session, stabilné result ID a pôvodný deň pri retry bez duplicít/prepisu. Nový výsledok po polnoci ide do nového dňa. Rozhodnutie odlíšené od návrhu, summary má zdroje. | S, U, P |
| AC-12 | Samostatná skúška | Dva vstupy a druhá nová konverzácia; 1–2 netechnickí piloti vedia zadať, posúdiť a nájsť výstup bez zásahu autora. PASS doloží všetkých päť bodov Čo si odnášate z aktuálneho pracovného listu. Účastník si vytvorí vlastného odborného zamestnanca aj jeho prvý workflow; prvý test/opravný krok a druhý vstup, potom samostatné pokračovanie z uložených dát. | P |
| AC-13 | Bez participant runtime, chýbajúci nástroj/sieť | Inštalácia prevezme pripravené súbory z konkrétneho commitu bez spustenia Node/Gitu/Pythonu alebo stiahnutého programu. Nesprávny hash/cesta, chýbajúca sieť/nástroj či neúplný marker vedú ku checkpointu bez resetu. Používateľ nezadáva terminálové príkazy. | S, U, P |
| AC-14 | Verejný release | Žiadne súkromné údaje/cesty/konfigurácie; licencie/NOTICE pre skutočne publikovaný obsah a assets overené; súkromný workspace sa neodosiela. Dokumentácia na review je odlíšená od inštalovateľného release. | S |
| AC-15 | Nadradené pokyny | Claude s nadradeným CLAUDE, Codex s override/global kontextom: preflight zistí dostupné relevantné pokyny, import/načítanie sa v fresh session preukáže; cudzia konfigurácia sa nemení a konflikt má checkpoint. | S, U |
| AC-16 | Sync a zastaraný zápis | Systémový writer overí byte hash, bežný agent použije fresh čítanie/cielený patch alebo append/readback. Zmena uložená v Obsidiane pred aktuálnym agentovým čítaním a konfliktová kópia sa zachovajú. Súbežný externý zápis počas operácie sa testuje/vykáže ako pozorované správanie s checkpointom; zachovanie neuloženého alebo súbežne prepisovaného editora sa negarantuje. Definované sync signály, zmena zariadenia s UI potvrdením v lokálnej evidencii; neznáma aktuálnosť blokuje dotknutý zápis. Bez sľubu distribuovaného locku. | S, U, P |
| AC-17 | Nedôveryhodný zdroj | Wiki/meeting zdroj s vloženým pokynom nemení oprávnenia/kanonické pravidlá ani nespustí externú operáciu. Podklady zostávajú zachované, nález je vysvetlený. | S, U, P |
| AC-18 | UI schvaľovací flow | Skutočný UI flow a schválenia na Macu/Windowse pri setupe, novom zamestnancovi aj bežnej práci. Režim workspace-write vysvetlený, full access nevynucovaný. Zaznamenané skutočné natívne súborové/HTTP/hash nástroje a oprávnenia; inštalácia nemení ExecutionPolicy ani globálnu konfiguráciu. Managed zamietnutie má konkrétny checkpoint; úspech jedného klienta nenahrádza druhý. | U, P |
| AC-19 | Účastnícke materiály | Po čistej plnej inštalácii zo Začnite tu otvoriteľných 7 promptov a 3 vetvy s A/B/kritériami/manuálom. Voľba vetvy pred P1, zodpovedajúci zamestnanec/postup v P2/P3. Presné prompty/raw vstupy aktuálnej kanoniky zachované; fiktívny kontext v clipboarde izolovaný od firmy aj reálnych profilov/modelov/postupov. Demo práca má cestu Ukážky/Workshop/<vetva>/; P6 nájde uložený výsledok A. Zhoda všetkých 13 vložených blokov podľa §11: raw bajty a meraný povrch, koncový LF a iba doložená Windows LF→CRLF inverzia vykázané osobitne. Integračné markery vyriešené a manifest reference existujú. Zostavenie bez vaultu/siete, cudzí obsah zachovaný. Skutočný copy success/failure/keyboard/no-JS overený v deklarovanom HTML povrchu; Obsidian výsledok samostatne. Účastník vloží text do AI klienta, vytvorí zamestnanca/workflow a pokračuje v novom chate; source/build/pilot oddelené. | S, U, P |

Test report: pin/verzia balíka, OS/architektúra, klient/verzia/režim oprávnení, typ úložiska, scenár, dátum, dôkaz, PASS/PARTIAL/FAIL/UNKNOWN a recovery. Source/unit kontrola, UI discovery a používateľský pilot sú samostatné dôkazy.

### Najmenší praktický pilot pred dokončením inštalátora

1. Na Macu a Windowse v podporovanom lokálnom klientovi otvoriť čistý neversionovaný koreň; zistiť účet/režim a schvaľovacie body bez vypínania ochrán.
2. Overiť prevzatie hotových súborov z konkrétneho commitu, presné checksumy a obmedzený zápis bez Node; potom fresh načítanie pokynov a inline Olivera. Jeden test má aj nadradený CLAUDE.
3. Uložiť stav/denný blok a založiť jednu odbornú rolu, aby sa preverila regenerácia adaptérov po setupe.
4. Overiť opakovanie nad personalizáciou; offline manuál a konfliktný/stale zápis. Na deklarovanom cloudovom priečinku zmeniť checkbox a prejsť na druhé zariadenie po dokončenom sync.

Pred širokým workshopovým releasom doplniť všetky štyri OS×klient základné kombinácie a deklarované cloudové scenáre/architektúry. Podporovaná podmnožina sa zverejní podľa dôkazov; ostatné zostávajú UNKNOWN a dostanú svoj test. Úspech malej skúšky neuzatvára celú maticu.

## 17. Otvorené technické body pre implementáciu a test

V1.8 zachováva cieľ Olivera, troch modelových procesov, jednej tabule a jednej obsahovej kanoniky. Zjednodušuje prvú inštaláciu na prevzatie hotových súborov bez participant runtime a dopĺňa voliteľný cloudový krok. Prijaté opravy A1–A17 a M1–M10 platia tam, kde ich nový distribučný kontrakt výslovne nenahradil. Obsahový modul aj súborový základ majú vlastné dôkazy; plná integrácia, Oliver/HTML manuál a účastnícky pilot sa neposudzujú ako dokončené iba z úspešnej kópie. AC-01–19 zostávajú stabilnými identifikátormi.

Otvorené zostávajú:

1. Podporované verzie klientov/OS a ich natívne nástroje, účet/autentifikačná cesta a dostupné limity/náklady konkrétnych účastníkov.
2. Overená download/copy cesta hotových súborov na čistom Macu/Windowse bez participant runtime; presné UI schválenia a recovery neúplnej inštalácie.
3. Reálne natívne vyvolanie/selector, načítanie pri novej session a správanie z podpriečinka bez Gitu; prípadná bezpečná per-project root konfigurácia.
4. Doplňujúca schéma profilov/modelov nad záväzným základom §7/12, generátor indexov/adaptérov, licenčne posúdený reader/engine a overenie sanitizácie.
5. Konkrétne cloudové sync prípady, obmedzenia cesty a súbežného editora, netechnický pilot a testovacia matica. Interný Mac dôkaz nie je dôkaz celého startera.
6. Licenčná voľba verejného balíka, verzie/licencie/NOTICE budúcich bundled assetov a implementácia/test recovery podľa uzavretého kontraktu §13. Licenčná voľba sa nerobí automaticky iba preto, že repo je verejné.

Review má uviesť konkrétny chýbajúci kontrakt alebo najmenší test, ktorý bod uzavrie. Povinné jadro Oliver/tím/procesný generátor/slovenčina/tabuľa/denný trail zostáva; materiálny konflikt potrebuje dôkaz a najmenšiu alternatívu zachovávajúcu cieľ.


## 18. Historické zdroje, podklady a stav overenia do 14.10.2026

Tento dokument obsahuje celé zadanie potrebné na produktové/architektonické review z iného zariadenia. Súkromný Second Brain, osobné profily ani prevádzková evidencia autora nie sú potrebné.

Pôvodný interný harness/process-manual kód nie je publikovaný. Potreba odstrániť pevné firemné cesty/register/role/branding/platformové predpoklady je požiadavka §8; konkrétna vhodnosť reuse kódu a jeho licencie sú samostatné UNKNOWN checkpointy. Chýbajúci kód nebráni posúdeniu zadania, nevydáva sa však za overenú implementáciu.

Primárne zdroje načítané pri posúdení review 12.10.2026:

- [OpenAI — AGENTS](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Skills](https://learn.chatgpt.com/docs/build-skills), [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Approvals/security](https://learn.chatgpt.com/docs/agent-approvals-security).
- [Claude — Memory](https://code.claude.com/docs/en/memory#agents-md), [Skills](https://code.claude.com/docs/en/skills), [Setup](https://code.claude.com/docs/en/setup).
- [Agent Skills specification](https://agentskills.io/specification), [Obsidian Properties](https://obsidian.md/help/properties), [LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).

Klientské technické údaje sú časovo citlivé; implementácia znovu preverí verzie/režimy z oficiálnych zdrojov. Konkrétna podporovaná verzia Node a pôvod artefaktu sú checkpoint, nie už vybraný release.

Claude read-only review pôvodnej v1.0 bolo PARTIAL bez P0. V1.2 zapracúva potvrdené opravy a korekcie: počet schválení sa negarantuje, hash neoverí vzdialený sync, checksum zdrojov/archívov používa presné bajty. Reviewer uviedol obmedzenie nezávislosti prostredia a nedostupnosť interného kódu; nejde o runtime pilot. Nový inštalátor, Windows/cloud scenáre, native selector a účastnícky pilot sú **NOT TESTED**. Claude review v1.2 commitu 5c1e08b bolo PARTIAL bez P0; N1–N15 sú zapracované v tejto revízii, s obnoviteľným update namiesto sľubu viac-súborovej atomicity a lokálnymi device checkpointmi. Doručené Claude review v1.3 identifikovalo M1–M10; ich stav v aktuálnom kontrakte je v §23. Externé read-only review v1.6 na 2b969c0 bolo doručené 14.10.2026; uvádza 9 PASS/1 SKIP, nezávislé build/readback kontroly a A1–A17. Autor overil dva reprodukovateľné nálezy v module a dokumentové spresnenia; aktuálne zapracovanie je uvedené v §24. Nové cielené review v1.7 a runtime pilot zostávajú otvorené.


Primárne zdroje cielene znovu čítané 13.10.2026: [Claude Tools](https://code.claude.com/docs/en/tools-reference), [Memory](https://code.claude.com/docs/en/memory), [Skills](https://code.claude.com/docs/en/skills), [Microsoft Execution policies](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies), [Node verifying binaries](https://github.com/nodejs/node#verifying-binaries), [Marked](https://marked.js.org/), [Mermaid securityLevel](https://mermaid.js.org/config/schema-docs/config-properties-securitylevel.html). Dokumentácia overuje vybrané kontrakty; runtime matica zostáva NOT TESTED.

## 19. Historický ďalší postup pred prvou implementáciou

1. Cielene overiť zapracovanie A1–A17 vo v1.7, konzistenciu zmenených kontraktov a skutočný obsahový modul. Review pripraví materiálne nálezy/testy, samo nemení prijaté požiadavky.
2. Po zadaní implementácie začať najmenším platformovým pilotom podľa §16 a uzavrieť runtime/distribúciu/UI oprávnenia.
3. Nadviazať čistou implementáciou šablón, procesov a adaptérov; reusovať len posúdené/licenčne overené minimum.
4. Pred workshopovým releasom doplniť AC-01–19, deklarovanú platformovú maticu, netechnický pilot a recovery.

Publikácia špecifikácie nie je inštalovateľný release. V repozitári nie je samostatný review prompt; autor ho odovzdáva v chate.

## 20. Zmeny vo v1.3

- Priečinok každej roly s vlastným SKILL, workflowmi a referenciami; rozlíšenie workflow/subagent a jediné miesto postupu.
- Oliverov onboarding workflow; jedna tabuľa Dokončenie company-os s konkrétnymi otázkami, stabilnými ID a cieľmi odpovedí; pripravené osobné/firemné profily.
- Prenosné AGENTS zásady a routing cez index; Mapa systému nad celým OS, typové metadata, relevantné a spätné odkazy, ochrana originálov.
- Odstránené historické produktové formulácie; jasný výsledok základného balíka a samostatné nastavenie prístupov/integrácií.

| Claude nález | Zapracovanie a overenie |
|---|---|
| N1 | Dôveryhodný pokyn → manifest → archív/runtime; správca overuje Node podpis. §13, AC-13. |
| N2 | Systémový writer vs bežné cielené úpravy/append, fresh čítanie a readback; bez sľubu CAS pre natívne nástroje. §12, AC-09/16. |
| N3 | Windows jednotlivé príkazy, bez trvalej zmeny policy/automatického Bypass; GPO checkpoint. §13, AC-18. |
| N4 | Pozorovateľné sync signály, lokálna evidencia UI potvrdenia, jeden zapisovateľ. §12/14, AC-16. |
| N5–N7 | Kolízie ID, skutočný wrapper/trust stav a staging/journal/installed_version/recovery. §12/13, AC-05–07. |
| N8–N9 | AGENTS iba index pointer, stabilné task ID na tabuli. §4–6, AC-09. |
| N10–N13 | HTML/URL negatívne testy, Mermaid strict, import recovery, plné wiki cesty, ASCII tim.html, backtick cesty. §3/8/12, AC-02/08/15. |
| N14–N15 | Zdieľaný manifest iba apply/update; per-device evidence mimo sync; dátum/ID denného bloku a retry. §10/13, AC-11/16. |

Všetkých 18 AC je požadovaným budúcim dôkazom. Review a publikácia dokumentov nepotvrdzujú inštalátor ani podporu všetkých kombinácií.

## 21. Zmeny vo v1.4

- Tri povinné štartovacie procesy s modelom/textom/mapou: firemný základ, nový AI zamestnanec, tvorba/úprava postupu.
- Model je kanonika krokov/otázok/kritérií; príslušné Oliverove workflowy sa generujú. Tým sa nahrádza pôvodná v1.3 autorita editovateľného onboarding workflowu.
- Úvodný offline HTML manuál obsahuje Olivera a tri procesy už po inštalácii, s otvoriteľným textom/mapou/zodpovednosťami a obojstrannými väzbami.
- Aktualizácia prehľadov a ownership seeded modelov/generated pohľadov; rozšírené AC bez zmeny 18 stabilných ID.
- Workshopová cesta: kontext/priority → vlastný odborný zamestnanec → prvý workflow → dva vstupy → nový chat/uložené pokračovanie. Dokumentové zadanie nie je funkčný release.

## 22. Zmeny vo v1.5

- Pribalené účastnícke promptyP1–P7 a3fiktívne vetvy sA/B cez blok Začnite tu → Workshop.
- Jedna udržiavaná obsahová kanonika, sanitizované exporty/provenance a reprodukovateľný lokálny build bez privátneho vaultu.
- Kombinované demo-copy s viditeľným kontextom/fiktívnosťou, prístupné stavy a ručný fallback; Obsidian/HTML/pilot overované samostatne.
- Presné pôvodné prompty/vstupy, žiadny lektorský scenár ani súkromné interné odkazy; nové AC-19.

## 23. Zmeny vo v1.6 a stav Claude M1–M10

Tomáš schválil zapracovanie opráv a publikáciu špecifikácie aj celého súčasného účastníckeho modulu. Nálezy pochádzajú z review publikovanej v1.3 (b1fe6a7); časť M1 už vyriešila v1.4. Tabuľka hodnotí **dokumentový kontrakt**, nie vykonaný inštalačný/runtime test.

| ID | Zapracovanie / miesto | Otvorený implementačný dôkaz |
|---|---|---|
| M1 | Jeden model, generated workflow, prevod vlastného workflowu a stable step ID. §7–8. | Vytvoriť/upraviť proces bez druhej editovateľnej procedúry; validácia step odkazov. |
| M2 | Fáza 0 overí manifest/archív a bezpečne rozbalí mimo sync; INSTALL až z overeného stagingu. §13. | Čistý download/hash/extract walkthrough a negatívne piny. |
| M3 | Windows default native curl.exe/tar.exe/certutil.exe; module cmdlety iba po teste. §13. | Skutočný klientský shell, PS5.1 Restricted/pwsh a cesty s medzerami/diakritikou; bez zmeny policy. |
| M4 | Mapa schopností→konkrétna kanonika/trieda; spoločné package postupy, schéma a firmové rozšírenia odlíšené. §2–4/11–13. | Core súbory a aktualizácia bez straty firemných rozšírení. |
| M5 | Zdieľaná pending/recovery transakcia a hashovaná záloha, lokálny journal; marker nie je záruka cloudového poradia. §13. | Prerušený apply a recovery na B bez pôvodného journalu. |
| M6 | Nadradené discovery vrstvy, značka wrappera a samostatný U dôkaz/fallback. §12, AC-06/15. | Native vyvolanie vs. osobná kolízia/trust stav; source verify ho nenahrádza. |
| M7 | Uzavretý základný enum a priradenie šablón; kompatibilné deklarované rozšírenia. §12. | Efektívny validator načíta jedinú schému + deklaráciu Mapy. |
| M8 | Jednoznačné agentové/wiki cesty pre všetky opakovateľné názvy; relatívny pohľad má známy základ. §12. | Duplicate-basename a link lint prípady. |
| M9 | Otázky označiť vyriešené s odkazom; chýbajúce/duplicitné ID má recovery bez reseedu. §6, AC-09. | Ručné editácie/kópia/odstránenie riadku v Obsidiane a nový chat. |
| M10 | Per-device kľúč workspace_id + kanonický root; kópia/presun má nový preflight. §13. | Dve kópie s rovnakým workspace_id na jednom zariadení. |

AC-02 spresňuje návrat do rootu, AC-06/10 merateľný dôkaz a AC-16 zachovanie vopred uložených zmien bez neuskutočniteľnej garancie súbežného editora. Ku každému z 19 stabilných AC sú priradené požadované typy dôkazu S, U, P alebo ich kombinácia. Pravidlá v1.6 nerobia z 10 komponentových testov dôkaz celého inštalátora.

Repozitár obsahuje sanitizované účastnícke snapshoty/provenance, export/build skripty, vlastné lokálne HTML assets, fragment Začnite tu a testy. Presné texty 7 promptov a 6 pôvodných vstupov zostávajú zachované; fiktívne demo bloky sú odvodené pohľady. [Stav modulu a limity](workshop-module-status.md), [postup zostavenia](../scripts/WORKSHOP.md). V tomto module sú iba vlastné zdroje a Node built-ins; budúce bundled Mermaid/YAML/Markdown/runtime artefakty majú samostatnú licenčnú/release bránu. Zverejnenie autorových súborov samo neudeľuje novú otvorenú licenciu; licenčná voľba zostáva explicitným krokom.

Primárne Microsoft podklady k oprave Windows kontraktu znovu overené 14.10.2026: [Execution policies 5.1](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-5.1), [curl](https://learn.microsoft.com/en-us/windows/curl/), [tar](https://learn.microsoft.com/en-us/windows/tar/), [certutil](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/certutil#-hashfile). Dokumentácia neurčuje PASS konkrétneho stroja/shellu; Windows runtime zostáva NOT TESTED.


## 24. Zmeny vo v1.7 po Claude A1–A17

| Nález | Zapracovanie a miesto | Ďalší dôkaz |
|---|---|---|
| A1 | Pomenovaná budúca kanonická šablóna pokynu Fázy 0, jeden release pokyn s pinmi a správcom nahraný asset, §13/15. Bezpečné poradie už bolo súčasťou v1.6. | Implementácia šablóny/príkazov a tri negatívne scenáre pred INSTALL; zatiaľ NOT TESTED. |
| A2 | Prvý deterministický render ôsmich setup úloh/otázok vykoná apply z modelu; Oliver aktualizuje existujúcu tabuľu, §5/6. | Dve prvé inštalácie a zhoda s modelom; NOT TESTED. |
| A3 | Windows absolútne System32 cesty, shell/policy report a Claude default/RESPECT/Codex matica, §13/AC-18. | Skutočný Windows pilot; dokumentované klientové správanie nie je runtime PASS. |
| A4 | Zadaná práca má prednosť; otázka potrebná k výsledku alebo dobrovoľné pokračovanie onboardingu, §4/5. | P6 pri otvorenom setupe; U/P. |
| A5 | Jednotlivé otázky s odkazmi na odpovede, neznáme/neplatné ID a cielený checkpoint, §6/AC-09. | Fixture a riadený klientský scenár; S/U/P. |
| A6 | U zahŕňa riadené správanie agenta; AC-10/11/17 majú S/U/P, §16. Unit dôkazy deterministických častí zostávajú. | Reálne scenáre v klientovi, oddelene od unit testu. |
| A7 | Demo cesta a ochrana reálnych modelov/postupov; payload obsahuje všeobecnú zásadu a miesto pokračovania, §3/11/AC-19. | Source kontrola; marketing a stretnutie v novom chate zatiaľ U/P otvorené. |
| A8 | Voľba vlastných vstupov alebo demo vetvy pred P1; P2/P3 podľa oblasti a otvorenie portálu bez Obsidianu, §11 a modul. | Úvodný source/build; netechnický pilot otvorený. |
| A9 | Company-os root ako samostatný Obsidian trezor; ancestor marker iba signál, §14. | Root odkazy a skutočná UI skúška. |
| A10 | LF checkout pravidlo v .gitattributes, §14 a modul. | CRLF checkout simulácia na Macu je samostatná od Windows runtime. |
| A11 | Doplnené typy postupov/návodov a ukážok, §12; základný enum ostáva. | Budúci effective validator/čistá inštalácia. |
| A12 | Presná zhoda 13 vložených blokov; jediná povolená odchýlka je vynechaný koncový LF, §11/AC-19. | Reálny clipboard/paste test všetkých blokov otvorený. |
| A13 | Nezobrazené integračné markery a povinný prenos existujúceho komponentového manifestu, §3/11 a modul. | Source/build teraz; plná integrácia a overenie manuálu neskôr. |
| A14 | Firemné vs klientské/projektové rozhodnutia, §10. | Dokumentová zhoda routingu. |
| A15 | Opravená Claude memory kotva; schválené medzery v kanonickom príklade cez export, §3/18 a podklady. | Zdrojový/export diff a provenance. |
| A16 | Privacy filter odlišuje token ERP od bežného slova; reálne testované Node verzie sa vykazujú bez odvodzovania bootstrap minima, modul. | Pozitívny/negatívny test, runtime rozsah iba podľa dôkazov. |
| A17 | Viditeľný kontrolný bod P5/P7 mimo nezmenených fenced promptov, §11 a pracovný list. | Source/export/parser. |

V1.7 je špecifikácia a opravený účastnícky modul. Konkrétne aktuálne source/build výsledky sú v docs/workshop-module-status.md; celý inštalátor, modely/Oliver/manuál a používateľský pilot zostávajú samostatnou budúcou prácou. Detailný audit prompt sa odovzdáva iba v chate.


## 25. Prvý funkčný celok — R1–R4 a foundation

Implementácia schválená14.10.2026 podľa v1.7. [Plán a dôkazy](core-foundation.md) držia konkrétny rozsah0.1.0-core.1: Fáza0/release/runtime, bezpečný fresh apply/verify, profily/tabuľa/model a zachovanie personalizácie. R1 je zapracovaný do§11/AC-19, R2–R4 do účastníckeho modulu/testov. Pôvodné7promptov/6rawblokov zostávajú zachované. Toto je prvý celok postupnej implementácie; celý Oliver/process/manual/workshop a platformový pilot sa ním neoznačujú dokončené.


## 26. Aktuálna zmena v1.8 — inštalácia bez Node

Schválené 15.10.2026. Aktuálny kontrakt je v §1–17, návod v root INSTALL a stav overenia v [reporte jednoduchej inštalácie](simple-install.md). Predchádzajúce §18–25 zachovávajú históriu zdrojov, auditov a prvého foundation vydania; ich Node/Fáza 0 postup sa nepoužíva ako predvolená inštalácia. Pripravený obsah `starter/` je odvodený z existujúcej kanoniky; jednoduchá verzia je `0.2.0-simple.1`.

Overenie zmeny v1.8: 49/49 source testov bez SKIP, reálny GitHub → nový Codex chat → uložený fiktívny firemný kontext → druhý nový chat/retry 0 zápisov a 32 nezmenených hashov/mtime; nezávislé Viktor a Nina kontroly PASS. Source commit `d8d3e14c7e5f18a193b81a9c5e5bc08926af852b` má 67 úplne overených vzdialených blobov. Dokumentové spresnenia nemenia payload. Prostredie a hranice sú v [aktuálnom reporte](simple-install.md). Úspech tohto celku neuzatvára AC celého systému ani Windows/Claude/cloud pilot.
