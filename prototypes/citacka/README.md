# Prototyp: čítačka procesného manuálu bez Node

Overuje jednu vec: či sa procesný manuál s mapou dá otvoriť priamo zo súboru (`file://`), bez servera, internetu a bez zostavenia cez Node. Priečinok `AI OS/` má rozloženie, aké sa plánuje v starteri.

## Ako to funguje

| Súbor | Úloha | Kto ho mení |
|---|---|---|
| `AI OS/Postupy/<id>/model.yaml` | jediný zdroj postupu | asistent |
| `AI OS/Postupy/<id>/model.js` | doslovná kópia modelu, ktorú vie načítať prehliadač | asistent, iba kopírovaním |
| `AI OS/Postupy/register.js` | zoznam postupov v manuáli | asistent, jeden riadok na postup |
| `AI OS/Postupy/_citacka/` | čítačka, kontrola modelu, js-yaml a Mermaid | nikto, je súčasťou balíka |
| `AI OS/Manuál.html` | vstup pre človeka | nikto |

Prehliadač pri otvorení zo súboru nenačíta `model.yaml` priamo. Preto `model.js` obsahuje ten istý text medzi prvým a posledným riadkom:

```
CompanyOS.model("<id>", function () {/*
…presný obsah model.yaml…
*/});
```

Zhodu overí asistent natívnym nástrojom, napríklad na macOS:

```sh
sed '1d;$d' model.js | cmp - model.yaml
```

Model nesmie obsahovať znaky `*/`. ID postupu aj krokov sú bez diakritiky; cesty od `Manuál.html` k čítačke a modelom sú zámerne iba ASCII, aby ich nerozbilo rozdielne kódovanie názvov pri rozbalení ZIPu.

## Čo je overené

Headless Chrome na macOS, otvorenie cez `file://`:

- zoznam postupov, text krokov a mapa sa vykreslia, uzly mapy vedú na kroky;
- chybný model a chýbajúci `model.js` zobrazia zrozumiteľnú chybu, ostatné postupy fungujú ďalej;
- neplatné ID v registri sa ignoruje;
- text modelu s `<script>`, `onerror` a `javascript:` sa zobrazí ako text a nič nespustí.

## Čo overené nie je

Windows, Edge, Safari, Firefox, otvorenie z OneDrive, Dropboxu a Google Drive, rozbalenie ZIPu na Windowse, celá obrazovka a ovládanie klávesnicou v skutočnom okne prehliadača. Ani to, či asistent po zmene modelu spoľahlivo obnoví `model.js`.

## Rozdiely oproti modelu vo vaulte

Zjednodušený model: povinné sú `id`, `title`, `version`, `updated`, `owner`, `trigger`, `description`, `start`; pri kroku `id`, `type`, `title`, `owner`, `detail`. Voliteľné sú `input`, `output`, `owners`, `notes`, `evidence`, `map_title` a nový príznak `human: true` pre krok, kde rozhoduje človek. Šablóny `{{rules.x}}`, `authority`, `packageId` a typ `closed` tu nie sú.

## Knižnice

js-yaml 4.1.0 (MIT) a Mermaid 11.12.0 (MIT), pribalené lokálne. Pred vydaním treba doplniť texty licencií a kontrolné súčty.
