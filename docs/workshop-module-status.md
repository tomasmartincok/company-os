# Účastnícky modul — stav overenia

V1.7 opravuje účastnícky modul podľa schválených A7/A8/A10/A13/A15/A16/A17. Kanonické podklady boli aktualizované a export/provenance obnovené 14.10.2026. Sedem promptov P1–P7 aj šesť raw A/B blokov zostali bajtovo totožné s v1.6; obsahové korekcie sú mimo nich (úvod, kontrolné body P5/P7 a dve medzery v demo kontexte inboxu). Zostaviteľný komponent nie je celý inštalátor ani účastnícky release.

Prostredie: macOS 27.0.1 / arm64. Source/export kontrola, **14/14 testov bez SKIP** a čerstvé zostavenie prešli na existujúcich Node.js **24.13.0** a **26.5.0**. Najnižšia reálne testovaná verzia v tomto výkone je 24.13.0; nejde o potvrdenie všetkých vyšších verzií, Windows runtime alebo budúci bootstrap pin. Nové závislosti sa nepridali.

| Kontrola | Stav a rozsah dôkazu |
|---|---|
| Zdrojový export | PASS: snapshoty/provenance porovnané s aktuálnou kanonikou, sedem promptov/šesť raw blokov zachované. Lektorský scenár, súkromné metadata/odkazy a distribučný appendix mimo exportu. |
| Skorá voľba a demo | Source/build PASS: voľba vlastných vstupov alebo vetvy pred P1, P2/P3 podľa oblasti, návod obsahuje otvorenie portálu bez Obsidianu. Viditeľný payload určuje Ukážky/Workshop/<vetva>/, uloženie A a načítanie pri B, chráni reálne profily/modely/postupy pred demo údajmi. Skutočný agentový scenár zostáva U/P otvorený. |
| Build a manifest | PASS: deterministický nový výstup, validné existujúce odkazy a hashe. Neprázdny/symlinkovaný cieľ sa odmietne bez prepisu. Nevyriešené nezobrazené manuálové markery sú dovolené len v samostatnom komponente; plný core ich musí nahradiť a obnoviť manifest podľa integračného kontraktu. |
| LF checkout | PASS: izolovaný Git checkout s core.autocrlf=true a core.eol=crlf zachoval LF a presné komponentové bajty vďaka .gitattributes. Je to simulácia na Macu, nie skutočná Windows skúška. |
| Privacy filter | PASS: bežné slovo „interpretácia“ prejde; token ERP a skutočné súkromné značky zostávajú odmietnuté. |
| Funkčné testy | PASS: 14/14 vrátane source porovnania a štyroch nových regresií. Clipboard success/denied/pending logika je testovaná v harness prostredí, nie v skutočnom prehliadači. |
| Obsidian 1.13.7 | Historická skúška 13.10.: testovací trezor, fragment → pracovný list a otvoriteľné ukážky. Native P1 copy → vloženie zachovalo text/diakritiku/vnútorné riadky, chýba jediný koncový LF (581 → 580 UTF-8 bajtov). P1 sa nemenil; nejde o dnešnú UI skúšku ani test všetkých 13 blokov. |
| HTML prehliadač | UNKNOWN: otvorenie file:// odmietla politika prehliadača. Bez obchádzania. Skutočné copy success/failure, klávesnica, no-JS, 320 px a 200 % zoom zostávajú otvorené. |
| Plná integrácia / nový chat | NOT TESTED: core, Oliver, tri modely/manuál, konzumovanie fragmentu, nahradenie markerov a výsledný manifest/ownership ešte nevznikajú týmto modulom. AC-19 potrebuje celý systém a vlastného zamestnanca/workflow. |
| Windows / cloud / začiatočník | NOT TESTED: osobitné piloty podľa špecifikácie; neprenášať Mac simuláciu na tieto výsledky. |

[Postup modulu](../scripts/WORKSHOP.md) uvádza reprodukciu a presný integračný kontrakt. Bez súkromných kanonických podkladov bežný offline beh označí jeden source test SKIP; ostatné kontroly a build fungujú z pribalených snapshotov. Skutočne vložený text všetkých 13 blokov sa má porovnať podľa §11 špecifikácie: raw UTF-8 bajty a meraný povrch, vynechanie posledného LF a iba doložená Windows LF→CRLF inverzia vykázané osobitne; súborové/release hashe ostávajú byte-exaktné. Tento nový celý clipboard scenár sa zatiaľ nevykonal.

Aktuálne pokračovanie14.10.: R1–R4 zapracované. Unicode filter prijíma Čerpáme/Čerpám/vyčerpá a odmieta ERP/(erp)/ERP-123. Demo opravy majú sekciu v zadanie.md, B konkrétne načíta tento súbor a vysledok-a.md; tabuľa/daily držia označený odkaz. Bez Gitu fixture bezpečne SKIP. Node24.16.0 macOS: source porovnanie14/14PASS, bez Gitu a súkromného zdroja12PASS/0FAIL/2SKIP. Pôvodné7+6bloky/provenance ostávajú zachované. Skutočný Windows clipboard test zostáva otvorený. [Prvý foundation core](core-foundation.md) má vlastný report; účastnícka plná integrácia ostáva ďalšou etapou.
