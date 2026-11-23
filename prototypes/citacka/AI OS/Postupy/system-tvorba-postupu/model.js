CompanyOS.model("system-tvorba-postupu", function () {/*
schemaVersion: 1
process:
  id: system-tvorba-postupu
  title: Vytvorenie pracovného postupu
  version: "0.1"
  updated: "2026-11-23"
  owner: Používateľ
  trigger: Používateľ chce opísať opakovanú úlohu, ktorú má robiť asistent.
  input: Konkrétna opakovaná úloha a jej podklady.
  output: Model postupu, mapa v manuáli a skúška na dvoch vstupoch.
  description: >-
    Pracovná verzia pre prototyp čítačky. Ukazuje, ako z rozhovoru vznikne jeden
    model a z neho text aj mapa.
  start: rozhovor
nodes:
  - id: rozhovor
    type: action
    title: Zistiť spúšťač, vstup, výsledok a kontrolu
    map_title: Rozhovor o úlohe
    owner: Asistent
    detail: >-
      Opýtať sa, čo úlohu spúšťa, čo je vstup, aký výsledok treba a podľa čoho sa
      výsledok skontroluje. Chýbajúce údaje sa nevymýšľajú.
    branches:
      - label: Pokračovať
        target: navrh
  - id: navrh
    type: action
    title: Navrhnúť kroky a vetvy
    owner: Asistent
    detail: Ukázať návrh krokov vrátane miesta, kde rozhoduje človek, a toho, čo sa stane pri chýbajúcom podklade.
    branches:
      - label: Ukázať používateľovi
        target: potvrdenie
  - id: potvrdenie
    type: decision
    title: Potvrdenie návrhu
    owner: Používateľ
    human: true
    detail: Používateľ návrh potvrdí alebo povie, čo zmeniť.
    branches:
      - label: Potvrdené
        target: ulozenie
      - label: Zmeniť
        target: navrh
  - id: ulozenie
    type: action
    title: Uložiť model a obnoviť manuál
    owner: Asistent
    detail: >-
      Uložiť model.yaml, vytvoriť jeho kópiu model.js, pridať postup do registra
      a overiť, že sa v manuáli zobrazí.
    evidence:
      - Postup je v zozname manuálu
      - Mapa sa vykreslí bez chyby
    branches:
      - label: Hotovo
        target: koniec
  - id: koniec
    type: terminal
    title: Postup pripravený na skúšku
    owner: Používateľ
    detail: Nasleduje skúška na dvoch rôznych vstupoch.
*/});
