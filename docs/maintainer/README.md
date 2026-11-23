# Pre správcu repozitára

## Čo je kde

| Miesto | Obsah |
|---|---|
| `workspace/` | pracovný priestor, ktorý dostane účastník. Obyčajné súbory, upravujú sa priamo. |
| `scripts/build-workspace.mjs` | overí modely postupov, obnoví ich kópie `model.js` a zostaví `outputs/company-os.zip` |
| `tests/workspace.test.mjs` | kontrola workspace: modely, odkazy, hlavičky |
| `prototypes/citacka/` | pôvodný prototyp čítačky manuálu s poznámkami o overení |
| `starter/`, `core/`, `INSTALL.md`, `content/`, `templates/`, ostatné skripty a testy | predchádzajúce vydanie 0.2 s inštaláciou cez agenta. Zatiaľ ponechané bez zmeny; [pôvodné README](README-0.2.md). |

## Vydanie

```sh
node scripts/build-workspace.mjs
node --test tests/*.test.mjs
```

Súbor `outputs/company-os.zip` nahrajte ako prílohu GitHub release s názvom `company-os.zip`. Odkaz v hlavnom README smeruje na prílohu posledného release.

Node 22.2 alebo novší, bez npm závislostí. Účastník Node nepotrebuje.

## Procesný manuál

Čítačka v `workspace/AI OS/Postupy/_citacka/` beží v prehliadači priamo zo súboru. `model.js` je doslovná kópia `model.yaml`; skript ju vytvára a `--check` stráži zhodu. U účastníka kópiu obnovuje jeho AI asistent podľa `workspace/AI OS/Systém/Model postupu.md`.

Pribalené knižnice: js-yaml 4.1.0 (MIT) a Mermaid 11.12.0 (MIT). Texty licencií treba pred verejným vydaním doplniť.

## Stav overenia

Overené na macOS: zostavenie ZIPu, rozbalenie, otvorenie manuálu zo súboru v Chrome. Neoverené: Windows, Edge, Safari, Firefox, cloudové priečinky, priebeh workshopových krokov so skutočným AI klientom a netechnickým účastníkom.

Podrobná špecifikácia a história predchádzajúcich verzií: [specifikacia.md](../specifikacia.md).
