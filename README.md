# company-os

Prenosný súborový Second Brain a pracovný systém firmy pre Codex alebo Claude Code, s voliteľným Obsidianom.

**Prvý inštalovateľný vývojový základ `0.1.0-core.1`:** vytvorí slovenské profily, mapu systému, pracovnú tabuľu s ôsmimi úlohami a pravidlá pre AI. Vie overiť uložený workspace a pri opakovaní zachovať doplnené údaje. Rozsah balíka je `foundation`; celý workshopový systém sa dokončuje postupne.

[Čo obsahuje prvý celok a ako je overený](docs/core-foundation.md) · [Inštalácia cez chat](INSTALL.md) · [Špecifikácia v1.7](docs/specifikacia.md)

## Začiatok

Na [vývojovom release](https://github.com/tomasmartincok/company-os/releases/tag/v0.1.0-core.1) je zostavený archív, manifest a `pokyn-instalacie.txt`. Účastník vloží celý pokyn do lokálneho Codexu alebo Claude Code a vyberie priečinok. Príkazy vykonáva agent; používateľ nemusí pracovať s terminálom. Piny v pokyne treba prevziať z dôveryhodného odovzdania správcu. Pred čítaním balíkového návodu alebo vykonaním kódu sa preverí manifest, archív a bezpečnosť jeho ciest.

Po inštalácii otvorte `Začnite tu.md` alebo agentovi povedzte, aby nadviazal z pracovnej tabule. Profily môžete dopĺňať postupne. Opakovaná inštalácia tej istej verzie zachová doplnené údaje; odlišná verzia alebo poškodený stav vyžadujú konkrétny recovery plán.

Oliver, ďalšie dva štartovacie procesy, procesný generátor a HTML manuál aj integrácia účastníckych materiálov patria ďalšej etape. Ich kontrakt je v špecifikácii. Skutočný Windows, cloud sync, Claude Code a začiatočnícky workshopový pilot majú vlastné otvorené skúšky.

## Účastnícky modul

Samostatný obsahový modul obsahuje sedem promptov P1–P7, tri fiktívne vetvy (marketing, inbox a stretnutie), vstupy A/B s kritériami kontroly, Markdown, lokálny HTML portál a fragment do Začnite tu. Demo sa kopíruje s kontextom a označením fiktívnosti; jeho opravy sa ukladajú do `zadanie.md`, tabuľa a denný zápis nesú iba označený odkaz. Lektorský scenár sa nedistribuuje.

[Postup exportu a zostavenia](scripts/WORKSHOP.md) · [Stav overenia modulu](docs/workshop-module-status.md)

## Pre udržiavateľa

Zdroj používa vstavané moduly Node.js, bez npm závislostí. Zostavenie zo snapshotov nepotrebuje súkromný vault ani sieť. Izolovaný Git test je voliteľná maintainer kontrola.

```sh
node --test tests/*.test.mjs
node scripts/build-workshop.mjs /cesta/k/novemu-vystupu
node core/installer.mjs apply --target /cesta/k/novemu-pracovnemu-priestoru
node core/installer.mjs verify --target /cesta/k/pracovnemu-priestoru
```

Release builder používa presný commit a vytvorí nový výstup s pinmi; postup je v [INSTALL.md](INSTALL.md). Build modulu, installed workspace, vývojový release a plný workshopový pilot sú osobitné výsledky. Audit prompt sa do repozitára nepridáva. Licenčný režim startera zostáva otvorený bod špecifikácie; runtime sa pripravuje z oficiálneho Node zdroja s jeho licenciou.
