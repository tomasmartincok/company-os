CompanyOS.model("system-tvorba-postupu", function () {/*
schemaVersion: 1
process:
  id: system-tvorba-postupu
  title: Vytvorenie pracovného postupu
  version: "1.0"
  updated: "2026-11-23"
  owner: Používateľ
  trigger: Používateľ chce opísať opakovanú úlohu pre zamestnanca alebo upraviť existujúci postup.
  input: Zamestnanec, konkrétna opakovaná úloha a jej podklady.
  output: Model postupu, jeho mapa v manuáli a odkaz v profile zamestnanca.
  description: >-
    Z rozhovoru vznikne jeden model postupu. Z neho číta zamestnanec pri práci
    aj manuál pri zobrazení, takže text a mapa sa nemôžu rozísť.
  start: rozhovor
owners:
  - Používateľ
  - Asistent
notes:
  - Postup sa mení iba v súbore model.yaml. Druhá ručne písaná verzia nevzniká.
  - Ak chýbajú ceny alebo iné dôležité údaje, asistent sa opýta.
  - Fiktívne údaje z ukážok sa do skutočného postupu neprenášajú.
nodes:
  - id: rozhovor
    type: action
    title: Zistiť, ako úloha prebieha
    map_title: Rozhovor o úlohe
    owner: Asistent
    detail: >-
      Zistiť, čo úlohu spúšťa, čo je vstup, aký výsledok treba, ako to používateľ
      robí dnes, ktoré rozhodnutia robí sám a podľa čoho výsledok skontroluje.
    branches:
      - label: Pokračovať
        target: navrh
  - id: navrh
    type: action
    title: Navrhnúť kroky, vetvy a kontrolu
    owner: Asistent
    detail: >-
      Ukázať návrh krokov. Musí obsahovať aspoň jeden krok, kde rozhoduje človek,
      a vetvu pre prípad, že chýba podklad.
    branches:
      - label: Ukázať návrh
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
      Postupovať podľa AI OS/Systém/Model postupu.md: uložiť model.yaml, vytvoriť
      jeho presnú kópiu model.js a nový postup pridať do registra.
    evidence:
      - Kópia je zhodná s modelom
      - Postup je v registri
    branches:
      - label: Otvoriť manuál
        target: manual
  - id: manual
    type: decision
    title: Zobrazí sa postup v manuáli?
    owner: Používateľ
    human: true
    detail: >-
      Používateľ otvorí alebo obnoví AI OS/Manuál.html a pozrie si mapu. Ak manuál
      ukáže chybu, prečíta ju asistentovi.
    branches:
      - label: Áno
        target: prepojenie
      - label: Manuál ukazuje chybu
        target: ulozenie
  - id: prepojenie
    type: action
    title: Prepojiť postup so zamestnancom
    owner: Asistent
    detail: >-
      Do profilu zamestnanca doplniť odkaz na model postupu. Aktualizovať Pracovnú
      tabuľu a Denník.
    evidence:
      - Profil zamestnanca odkazuje na postup
    branches:
      - label: Hotovo
        target: hotovo
  - id: hotovo
    type: terminal
    title: Postup pripravený na skúšku
    owner: Používateľ
    detail: >-
      Nasleduje skúška na dvoch rôznych vstupoch; druhý v novom rozhovore, aby sa
      ukázalo, že postup funguje aj bez pamäte predchádzajúceho rozhovoru.
*/});
