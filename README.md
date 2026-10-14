# company-os

Prenosný súborový Second Brain a pracovný systém firmy pre Codex alebo Claude Code, s voliteľným Obsidianom.

**Špecifikácia v1.6 a účastnícky modul na review:** špecifikácia a zostaviteľný obsahový modul pre účastníkov workshopu. Celý inštalátor company-os ešte nie je vytvorený.

[Prečítať špecifikáciu v1.6](docs/specifikacia.md)

Zadanie obsahuje Olivera, priečinky zamestnancov s vlastnými workflowmi, tri hotové štartovacie procesy a úvodný HTML manuál, procesný generátor, tabuľu dokončenia s otázkami, osobný a firemný profil, znalostnú bázu a denné zápisky. Podľa zadania bude inštalácia a nastavenie vedené chatom; cieľové platformy sú macOS a Windows. Revízia spresňuje metadata/prepojenia, overenie releasu, ochranu personalizácie, zápisy, synchronizáciu a obnovu aktualizácií.

Verejný dokument je samostatne použiteľný na review bez súkromného Second Brainu. Obsahuje 19 akceptačných kritérií a plán pilotu. Špecifikácia nepotvrdzuje funkčný inštalátor ani workshopový release. Detailný kontrolný prompt autor odovzdáva iba v chate.

Obsahový modul zahŕňa sedem promptov P1–P7, tri fiktívne vetvy (marketing, mailový inbox a stretnutie), vstupy A/B s kritériami kontroly, Markdown podklady, lokálny HTML portál a fragment do „Začnite tu“. Ukážka sa kopíruje spolu s demo kontextom a označením fiktívnosti. Lektorský scenár sa nedistribuuje.

Pre udržiavateľa je pripravený [postup exportu a zostavenia](scripts/WORKSHOP.md). Zostavenie používa pribalené snapshoty a vstavané moduly dostupného Node.js; nepotrebuje súkromný vault ani internet:

```sh
node scripts/build-workshop.mjs /cesta/k/novemu-vystupu
node --test tests/workshop-content.test.mjs
```

Tieto príkazy sú vývojová kontrola modulu. Účastnícka inštalácia vedená chatom, Oliver, štartovacie procesy, procesný manuál a čistý Mac/Windows pilot zostávajú ďalšou prácou. Výstup build-u je obsahový modul, nie hotový firemný workspace; cieľ musí byť nový alebo prázdny. Existujúci neprázdny cieľ sa neprepisuje.

V1.6 dopĺňa overenie balíka pred INSTALL, Windows bootstrap kontrakt, vlastníctvo systémových postupov/schémy, obnovu na druhom zariadení, ID úloh a typy dôkazov. [Stav overenia modulu](docs/workshop-module-status.md) odlišuje source/build, UI a celý používateľský pilot. Zdrojové skripty a šablóny sú súčasťou repozitára; vybudovaný náhľad patrí do `outputs/` alebo nového dočasného priečinka a nie je druhou obsahovou kanonikou.
