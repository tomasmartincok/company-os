# Účastnícky obsahový modul

Tento modul exportuje a zostaví lokálne workshopové podklady. Nevytvára celý company-os, Olivera, procesový manuál, runtime bootstrap ani hotový inštalátor.

## Autorita a obnova

Dva kanonické zdrojové dokumenty majú logické názvy `pracovny-list-a-prompty.md` a `ukazkove-vstupy.md`. Ich údržba zostáva mimo repozitárových snapshotov. `content/workshop/` obsahuje iba generovaný účastnícky export; neupravovať ho ako druhú kanoniku. `provenance.json` uchováva SHA-256 zdrojových bajtov, exportovaných bajtov a presných fenced textov bez súkromných ciest.

Udržiavateľ po zmene kanonických materiálov použije explicitnú cestu k ich priečinku:

```sh
node scripts/export-workshop.mjs --write <kanonicky-priecinok-materialov>
node scripts/export-workshop.mjs --check <kanonicky-priecinok-materialov>
```

Export odstraňuje vault frontmatter, súkromné wiki-linky a interný distribučný appendix. Účastnícke kontrolné body majú názov „Skontrolujte výsledok“. P1–P7 a pôvodné fenced A/B vstupy sa nemenia; export sa zastaví pri nesúlade alebo neznámom formáte. Kanonické zdroje používajú UTF-8/LF; CRLF sa odmietne, pretože HTML parser by v schránke normalizoval konce riadkov. Lektorský scenár sa nečíta ani neexportuje.

## Offline build

Build potrebuje dostupný kompatibilný Node.js a iba jeho vstavané moduly. Nepotrebuje vault, internet, package manager ani nové závislosti. Overená host verzia je zaznamenaná v odovzdaní; táto komponentová skúška nepotvrdzuje budúci bootstrap/runtime matrix.

```sh
node scripts/build-workshop.mjs <novy-alebo-prazdny-vystupny-priecinok>
node --test tests/workshop-content.test.mjs
```

Výstup obsahuje `Workshop/` s Markdown podkladmi, `index.html` a lokálnymi assets; fragment `Začnite tu.fragment.md` a komponentový manifest s hashmi. Zdroj fragmentu je `templates/zacnite-tu-workshop.md` a jeho odkazy sa vyhodnocujú po začlenení do koreňového `Začnite tu.md`.

Build pripravuje nový staging adresár a až potom ho premenuje. Existujúci neprázdny alebo symlinkovaný cieľ odmietne; do používateľského workspace sa týmto príkazom neaktualizuje. Opakovaný build do dvoch nových cieľov má rovnaké bajty. Po zlyhaní možno build zopakovať do nového cieľa. Staging po zachytenej chybe odstráni; zvyšok po násilnom ukončení procesu sa nepoužije. Ide o jednotlivú lokálnu operáciu, nie distribuovaný lock ani systémový upgrade kontrakt.

## Integrácia do celého balíka

Core build musí prevziať súbory `Workshop/`, začleniť fragment do existujúceho `Začnite tu.md`, zachovať používateľské dokumenty podľa ownership pravidiel a doplniť aktívny odkaz na existujúci `Manuál/index.html`. Tento komponent falošný alebo prázdny manuál nevytvára. Komponentový manifest je build evidencia, nie náhrada dôveryhodného release manifestu či podpisu.

P1–P7 sa kopírujú samostatne. HTML demo tlačidlá kopírujú odvodený viditeľný blok: fiktívnosť a izolácia → demo kontext zvolenej vetvy → presný A/B vstup. Rovnaké kombinované bloky vznikajú v distribuovanom Markdown podklade; pôvodné raw vstupy zostávajú nezmenené. Výstupný HTML aj Markdown sú generované pohľady.

Distribuované Markdown pohľady dostávajú verejný poznámkový frontmatter a vzájomné relatívne odkazy pod H1. Súkromné metadata sa nekopírujú; vlastník zostáva „neurčený“. Dátumy identifikujú túto obsahovú revíziu a pri ďalšom explicitnom exporte sa aktualizujú spolu s generátorom. Snapshoty sú exportné vstupy, nie pracovné poznámky nainštalovaného systému. Fragment zdedí metadata koreňového „Začnite tu“ až pri integrácii.

Po úspešnom clipboard promise HTML ohlási úspech. Pri zamietnutí alebo nedostupnej schránke ukáže a označí presný text na Ctrl+C/Cmd+C. Bez JS zostávajú všetky bloky čitateľné a označiteľné. Obsidian click-copy sa nesľubuje; ručné označenie je záložná cesta.

## Dôkazy

Source/export kontrola potrebuje kanonické podklady. Rozšírený test ju zapne cez task-specific premennú `COMPANY_OS_WORKSHOP_SOURCE`; bežný offline test ju označí SKIP a overí pribalenú provenance.

Zdrojová kontrola a funkčný komponentový build sa evidujú oddelene od reálneho clipboard/browser testu a čistého Mac/Windows účastníckeho pilotu. Core inštalácia ani nadviazanie cez skutočného zamestnanca nie sú týmto modulom vykonané.
