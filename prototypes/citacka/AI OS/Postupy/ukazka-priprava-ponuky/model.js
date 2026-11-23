CompanyOS.model("ukazka-priprava-ponuky", function () {/*
schemaVersion: 1
process:
  id: ukazka-priprava-ponuky
  title: Príprava cenovej ponuky
  version: "1.0"
  updated: "2026-11-23"
  owner: Majiteľ
  trigger: Zákazník poslal dopyt e-mailom alebo cez formulár.
  input: Text dopytu, platný cenník, vzor ponuky.
  output: Návrh ponuky pripravený na kontrolu a odoslanie majiteľom.
  description: >-
    Fiktívna ukážka. Asistent pripraví návrh ponuky z dodaných podkladov;
    cenu potvrdzuje a ponuku odosiela vždy človek.
  start: dopyt
owners:
  - Majiteľ
  - Asistent
notes:
  - Asistent ponuku nikdy neodosiela. Odoslanie je vždy krok majiteľa.
  - Cena, ktorá nie je v cenníku, sa nevymýšľa. Asistent sa opýta.
nodes:
  - id: dopyt
    type: action
    title: Prečítať dopyt a zhrnúť potrebu
    owner: Asistent
    detail: >-
      Vypísať, čo zákazník chce, do kedy a v akom rozsahu. Oddeliť to, čo zákazník
      napísal, od toho, čo si iba domýšľame.
    evidence:
      - Zhrnutie má najviac päť viet
      - Domnienky sú označené
    branches:
      - label: Pokračovať
        target: uplnost
  - id: uplnost
    type: decision
    title: Sú podklady úplné?
    owner: Asistent
    detail: >-
      Porovnať dopyt s cenníkom. Úplné znamená, že každá položka má cenu a je jasný
      rozsah aj termín.
    branches:
      - label: Áno
        target: navrh
      - label: Niečo chýba
        target: otazky
  - id: otazky
    type: action
    title: Pripraviť otázky pre zákazníka
    map_title: Doplňujúce otázky
    owner: Asistent
    human: true
    detail: >-
      Spísať najviac tri konkrétne otázky. Majiteľ ich pošle zákazníkovi a odpoveď
      vloží späť ako nový vstup.
    evidence:
      - Každá otázka sa viaže na konkrétnu chýbajúcu položku
    branches:
      - label: Zákazník odpovedal
        target: uplnost
  - id: navrh
    type: action
    title: Zostaviť návrh ponuky
    owner: Asistent
    detail: >-
      Vyplniť vzor ponuky položkami z cenníka. Uviesť rozsah, termín a platnosť
      ponuky. Nič, čo nie je v podkladoch, sa do ponuky nedostane.
    evidence:
      - Každá cena má zdroj v cenníku
      - Návrh je uložený pri zákazníkovi
    branches:
      - label: Odovzdať na kontrolu
        target: kontrola
  - id: kontrola
    type: decision
    title: Kontrola majiteľom
    owner: Majiteľ
    human: true
    detail: >-
      Majiteľ skontroluje cenu, rozsah a tón. Ak niečo nesedí, povie čo a prečo,
      aby sa oprava dala uložiť ako trvalé pravidlo.
    branches:
      - label: Schválené
        target: hotovo
      - label: Treba upraviť
        target: navrh
  - id: hotovo
    type: terminal
    title: Ponuka pripravená na odoslanie
    owner: Majiteľ
    detail: >-
      Majiteľ ponuku odošle sám. Asistent zapíše výsledok na pracovnú tabuľu
      a do denníka.
*/});
