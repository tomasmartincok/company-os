# Účastnícky obsahový modul

Tento modul exportuje a zostaví lokálne workshopové podklady. Nevytvára celý company-os, Olivera, procesový manuál, runtime bootstrap ani hotový inštalátor.

## Autorita a obnova

Dva kanonické zdrojové dokumenty majú logické názvy `pracovny-list-a-prompty.md` a `ukazkove-vstupy.md`. Ich údržba zostáva mimo repozitárových snapshotov. `content/workshop/` obsahuje iba generovaný účastnícky export; neupravovať ho ako druhú kanoniku. `provenance.json` uchováva SHA-256 zdrojových bajtov, exportovaných bajtov a presných fenced textov bez súkromných ciest.

Udržiavateľ po zmene kanonických materiálov použije explicitnú cestu k ich priečinku:

```sh
node scripts/export-workshop.mjs --write <kanonicky-priecinok-materialov>
node scripts/export-workshop.mjs --check <kanonicky-priecinok-materialov>
```

Export odstraňuje vault frontmatter, súkromné wiki-linky a interný distribučný appendix. Účastnícke kontrolné body majú názov „Skontrolujte výsledok“. P1–P7 a pôvodné fenced A/B vstupy sa nemenia; export sa zastaví pri nesúlade alebo neznámom formáte. Kanonické zdroje aj repo checkout používajú UTF-8/LF. `.gitattributes` s `* text=auto eol=lf` zachová bajty aj pri `core.autocrlf=true`; CRLF sa odmietne, pretože HTML parser by v schránke normalizoval konce riadkov. Lektorský scenár sa nečíta ani neexportuje.

## Offline build

Build potrebuje dostupný kompatibilný Node.js a iba jeho vstavané moduly. Nepotrebuje vault, internet, package manager ani nové závislosti. Overené 14.10.2026 na macOS arm64: Node.js **v24.13.0** a **v26.5.0**, na oboch 14/14 testov vrátane source/export kontroly a čerstvého buildu v simulovanom `core.autocrlf=true` checkoute. Najnižšia v tomto výkone skutočne testovaná verzia je **24.13.0**; iné verzie ani celý rozsah „>=“ sa tým nepotvrdzujú. Táto komponentová skúška nepotvrdzuje budúci bootstrap/runtime matrix.

```sh
node scripts/build-workshop.mjs <novy-alebo-prazdny-vystupny-priecinok>
node --test tests/workshop-content.test.mjs
```

Výstup obsahuje `Workshop/` s Markdown podkladmi, `index.html` a lokálnymi assets; fragment `Začnite tu.fragment.md` a komponentový manifest s hashmi. Zdroj fragmentu je `templates/zacnite-tu-workshop.md` a jeho odkazy sa vyhodnocujú po začlenení do koreňového `Začnite tu.md`.

Build pripravuje nový staging adresár a až potom ho premenuje. Existujúci neprázdny alebo symlinkovaný cieľ odmietne; do používateľského workspace sa týmto príkazom neaktualizuje. Opakovaný build do dvoch nových cieľov má rovnaké bajty. Po zlyhaní možno build zopakovať do nového cieľa. Staging po zachytenej chybe odstráni; zvyšok po násilnom ukončení procesu sa nepoužije. Ide o jednotlivú lokálnu operáciu, nie distribuovaný lock ani systémový upgrade kontrakt.

## Integrácia do celého balíka

Core build musí prevziať súbory `Workshop/` **aj existujúci root `workshop-component-manifest.json` vedľa `Workshop/`**. Relatívny zdroj v metadata `../workshop-component-manifest.json` musí po integrácii zostať dostupný a overiteľný; nevzniká nový manifest formát. Fragment sa začlení do existujúceho `Začnite tu.md` a používateľské dokumenty sa zachovajú podľa ownership pravidiel.

Nezobrazené integračné markery sú `<!-- company-os:workshop-manual-link:markdown -->` vo fragmente a `<!-- company-os:workshop-manual-link:html -->` v portáli. Core ich pred označením inštalácie za hotovú **musí** nahradiť aktívnym relatívnym odkazom na skutočne existujúci a overený `Manuál/index.html` (z portálu `../Manuál/index.html`). Nevyriešený marker alebo chýbajúci manuál blokuje úplnú integračnú akceptáciu; samostatný komponent nezobrazuje technické integračné vety ani mŕtvy odkaz.

Core po integrácii v prenesenom komponentovom manifeste zachová `sourceProvenance`, obnoví hashe a skutočný zoznam prenesených generated výstupov a vyradí konzumovaný a neprenesený `Začnite tu.fragment.md`; koreňový `Začnite tu.md` je seeded v installed ownership. Až potom vykoná verify. Tým manifest odráža aj konečné HTML po nahradení markeru. Komponentový manifest nenahrádza dôveryhodný release manifest či podpis.

P1–P7 sa kopírujú samostatne. HTML demo tlačidlá kopírujú odvodený viditeľný blok: fiktívnosť a izolácia → demo kontext zvolenej vetvy → presný A/B vstup. Rovnaké kombinované bloky vznikajú v distribuovanom Markdown podklade; pôvodné raw vstupy zostávajú nezmenené. Výstupný HTML aj Markdown sú generované pohľady. Vetva sa volí pred P1; P2/P3 vytvoria zodpovedajúcu všeobecnú rolu a postup. Demo zadanie, vstupy, výsledky a opravy patria do `Ukážky/Workshop/<branch-id>/`; B načíta A odtiaľ. Demo fakty a obmedzenia sa neprenášajú do skutočných profilov, modelov alebo workflowov. Trvalá oprava je potvrdená všeobecná zásada alebo výslovne potvrdené skutočné vlastné pravidlo.

Distribuované Markdown pohľady dostávajú verejný poznámkový frontmatter a vzájomné relatívne odkazy pod H1. Súkromné metadata sa nekopírujú; vlastník zostáva „neurčený“. Dátumy identifikujú túto obsahovú revíziu a pri ďalšom explicitnom exporte sa aktualizujú spolu s generátorom. Snapshoty sú exportné vstupy, nie pracovné poznámky nainštalovaného systému. Fragment zdedí metadata koreňového „Začnite tu“ až pri integrácii.

Po úspešnom clipboard promise HTML ohlási úspech. Pri zamietnutí alebo nedostupnej schránke ukáže a označí presný text na Ctrl+C/Cmd+C. Bez JS zostávajú všetky bloky čitateľné a označiteľné. Obsidian click-copy sa nesľubuje; ručné označenie je záložná cesta.

## Dôkazy

Regresný test izolovaného `core.autocrlf=true` checkoutu vyžaduje dostupný Git CLI pre udržiavateľa. Samotný obsahový build ani účastnícka inštalácia Git nepotrebujú. Test ani build Git automaticky neinštalujú.

Source/export kontrola potrebuje kanonické podklady. Rozšírený test ju zapne cez task-specific premennú `COMPANY_OS_WORKSHOP_SOURCE`; bežný offline test ju označí SKIP a overí pribalenú provenance.

Zdrojová kontrola a funkčný komponentový build sa evidujú oddelene od reálneho clipboard/browser testu a čistého Mac/Windows účastníckeho pilotu. Core inštalácia ani nadviazanie cez skutočného zamestnanca nie sú týmto modulom vykonané.
