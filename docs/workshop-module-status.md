# Účastnícky modul — stav overenia

Pôvodné overenie 13.10.2026 sa týkalo obsahového modulu v lokálnej v1.5. V1.6 publikuje tie isté obsahové zdroje s aktualizovanou špecifikáciou; Source/export porovnanie a offline build/testy boli zopakované 14.10.2026: 10/10 PASS, bez SKIP, na host Node.js v26.5.0. Obsahové bajty promptov/vstupov sa nemenili. UI výsledky nižšie pochádzajú zo skúšky 13.10.2026; dnes sa neopakovali. Nepotvrdzuje celý inštalátor company-os ani účastnícky release.

Prostredie komponentovej kontroly: macOS 27.0.1 / arm64, host Node.js v26.5.0. Táto host verzia nie je automaticky podporovaným alebo pripnutým runtime budúceho balíka.

| Kontrola | Stav a rozsah dôkazu |
|---|---|
| Zdrojový export | Sedem promptov a šesť pôvodných A/B vstupov zachované; snapshoty/provenance porovnané s kanonickými podkladmi. Interné odkazy, frontmatter, distribučné poznámky a lektorský scenár sa neexportujú. |
| Build | Deterministický lokálny výstup bez siete a vaultu; odkazy a manifest overené. Existujúci neprázdny alebo symlinkovaný cieľ odmietnutý bez prepisu jeho obsahu. |
| Funkčné testy | **PASS, 10/10 testov pri zapnutom porovnaní zdrojov.** Obsah, sanitizácia, escapovanie a clipboard success/denied/pending logika v testovom prostredí; nejde o skutočný prehliadač. |
| Obsidian 1.13.7 | Testovací trezor otvorený. Vstupný fragment → pracovný list funguje; ukážkový dokument otvoriteľný. Native tlačidlo P1 → vloženie do testovej poznámky zachovalo text, diakritiku a vnútorné riadky; chýba posledný koncový LF (581 → 580 UTF-8 bajtov). Nejde o byte-identický clipboard dôkaz ani test všetkých 13 blokov. |
| HTML prehliadač | **UNKNOWN:** automatizované otvorenie `file://` odmietla politika prehliadača. Žiadny náhradný povrch ani obchádzanie blokácie sa nepoužili. Reálny copy success/failure, klávesová záloha, no-JS a responsive/zoom skúška zostávajú otvorené. |
| Plná inštalácia / nový chat | **NOT TESTED:** core inštalátor, Oliver, štartovacie modely a procesný manuál sa týmto modulom nevytvárajú. AC-19 sa uzavrie až s úplným systémom a vlastným zamestnancom/workflowom. |
| Windows / sync úložiská / začiatočník | **NOT TESTED:** samostatný pilot podľa špecifikácie. |

Reprodukcia build-u a testov je v [postupe modulu](../scripts/WORKSHOP.md). Source porovnanie je zapnuté len vtedy, keď udržiavateľ vedome poskytne kanonický priečinok cez `COMPANY_OS_WORKSHOP_SOURCE`; bežný offline beh tento jeden test označí SKIP. Pribalené snapshoty a ostatné kontroly fungujú samostatne.

Ďalší krok: implementovať a overiť core inštalátor; začleniť fragment do skutočného „Začnite tu“, doplniť aktívny odkaz na existujúci manuál a vykonať deklarované HTML a Mac/Windows používateľské skúšky. Publikácia v1.6 zahŕňa zdroje modulu, šablónu a testy; predchádzajúce runtime obmedzenia zostávajú otvorené. Publikácia nie je inštalovateľný release.
