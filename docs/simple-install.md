# Inštalácia hotových súborov bez Node

Prijatá zmena 15.10.2026: účastník vytvorí prázdny priečinok, otvorí ho v lokálnom Codexe alebo Claude Code a vloží krátky prompt z README. Agent prevezme hotový obsah `starter/` z konkrétneho commitu GitHubu. Node patrí iba k zostaveniu a kontrolám správcu; účastník ho neinštaluje ani nespúšťa.

## Rozsah a akceptácia

- Predpripravená slovenská štruktúra, profily, pravidlá, mapa, tabuľa a jeden model firemného nastavenia; zdroj sa generuje z existujúcej kanoniky.
- Overenie zoznamu ciest a presných bajtov pred kopírovaním. Sieťové a súborové nástroje poskytuje klient/OS. Preberajú sa údaje, bez spustenia stiahnutého kódu.
- Nový alebo prázdny koreň; existujúca personalizovaná rovnaká verzia sa iba skontroluje, bez zápisov. Cudzí, neúplný alebo starší foundation priestor sa zachová a dostane konkrétny checkpoint.
- Voliteľne existujúci lokálne dostupný cloudový priečinok. Bez nastaveného cloudu sa pokračuje lokálne a zostane jedna úloha synchronizácie/zálohovania. Pri prechode zariadenia sa overuje aktuálny sync stav, nie iba lokálny hash.
- Čerstvá klientská skúška: inštalácia bez Node, uloženie fiktívneho profilu, opakovanie bez straty dát a pokračovanie v novom chate.
- Verejný GitHub stav a kanonická špecifikácia majú zhodný aktuálny kontrakt. Windows, Claude Code a skutočný cloud majú samostatný stav dôkazov.

Oliver, ďalšie procesové modely, generátor/manuál a integrácia účastníckeho modulu sa týmto rozsahom nedokončujú. Historický release `0.1.0-core.1` sa nemení; automatická migrácia z neho nie je súčasťou tohto vydania.

## Dopad a vlastníci

| Miesto | Krok a dôkaz | Vlastník |
|---|---|---|
| Core renderer/model, starter snapshot, manifest | Upraviť variant; exact-byte generated kontrola, metadata/linky/ID | Realizácia |
| INSTALL a README | Upraviť vstup na krátky chatový prompt a hotové súbory; reálny nový chat | Realizácia |
| Cloud návod, tabuľa a vstupné dokumenty | Voliteľný krok a jedna trvalá úloha; kontrola odloženia a opakovania | Realizácia |
| Špecifikácia §1–17 | Zosúladiť na v1.8, odstrániť povinný participant runtime; internal/public equality | Hlavný agent |
| Historický core release a jeho build | Zachovať reprodukovateľný starý zdroj/návod; regresné testy | Realizácia |
| Účastnícky modul | Overiť zachovanie P1–P7 a fiktívnych podkladov; celý obsah sa nemení | Hlavný agent |
| Second Brain / plán workshopu / denné zápisky / ERP09 | Uložiť konkrétny výsledok a ďalšie kroky s readbackom | Hlavný agent |
| HQ, osobné pravidlá, TOMARCO skills/harness, produkcia, automatizácie | Netýka sa: nemení sa ich autorita ani konfigurácia | Hlavný agent |
| GitHub zdroje | Publikovať iba verejný allowlist; overiť commit a prenesené súbory | Hlavný agent |

Obnoviteľný baseline: Git commit `5671466902da6f4c66b7894c966dea7db960c78c` a nezmenený historický prerelease. Súkromný checkout AGENTS a lokálne testovacie výstupy sa nepublikujú. Testy používajú výhradne nové dočasné pracovné priestory.

## Stav overenia

Pripravený variant `0.2.0-simple.1` obsahuje **29 dokumentov a manifest**. V cieľovom priestore navyše vzniknú dva malé záznamy v `.os-starter/`: presný zdrojový manifest a marker úspešného prevzatia. Inštalácia samotná nepotrebuje spustiť žiadny distribuovaný program.

- Úplná source suite **49/49 PASS, 0 SKIP** na Node 24.16.0, macOS arm64. Zahŕňa 7 nových skúšok jednoduchého setupu, 42 regresií core/release/workshop a kontrolu proti kanonickým účastníckym podkladom. Node bol použitý iba správcom pri testoch.
- Natívne macOS curl/copy/hash skúšky cez výslovne označený testovací harness: nový koreň s medzerami/diakritikou, personalizácia profilu/Začnite tu/tabule a vlastný súbor; retry 0 zápisov a rovnaké hashe aj časy zmien. Cudzí, legacy, čiastočný a symlink koreň sa zachovali. Poškodené bajty zastavili prípravu pred prvým cieľovým súborom; prerušená kópia nevytvorila úspešný marker a retry obsah nezmenil.
- Simulovaná cloudová voľba vyžaduje konkrétne potvrdenie dostupnosti; bez potvrdenia má checkpoint. Aj potvrdená voľba necháva zálohu neoverenú a otvorenú úlohu na tabuli. Toto je skúška rozhodovacej vetvy, nie skutočného poskytovateľa.
- `build-starter.mjs --check` overuje presné bajty proti kanonike, metadata, odkazy a nemenné setup ID; 0 zápisov. Samostatných 7 nových testov prešlo aj na Node 26.5.0 podľa implementačného handoffu.

Reálna inštalácia agentom z publikovaného GitHubu a následná nezávislá kontrola sa doplnia po vykonaní. Zdrojová kontrola Windows postupu nie je Windows runtime. Skutočný Windows, Claude Code, cloudový prenos/obnova, Obsidian a netechnický účastnícky pilot zostávajú otvorené.
