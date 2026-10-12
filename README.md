# company-os

Prenosný súborový Second Brain a pracovný systém firmy používaný cez Codex alebo Claude Code, s voliteľným Obsidianom.

**Aktuálny stav: dokumentácia na review pred tvorbou inštalátora.** Repozitár zatiaľ neobsahuje inštalátor ani funkčný workshopový release.

- [Kompletná špecifikácia v1](docs/specifikacia.md) — rozsah, Oliver, AI tím, procesy, pracovná tabuľa, znalostná báza, denné zápisky, onboarding, inštalácia a akceptačné kritériá.
- [Detailný prompt pre Claude Code](docs/claude-review-prompt.md) — nezávislé read-only review na inom zariadení bez súkromného Second Brainu autora.

## Ako urobiť review

Stiahni tento repozitár a otvor priečinok v Claude Code. Skopíruj prompt z druhého dokumentu. Claude má prečítať celú špecifikáciu, overiť aktuálne technické tvrdenia a vrátiť návrhy do chatu. Počas review nič neinštaluje ani nemení.

Alternatívny pokyn do chatu:

```text
Prečítaj README.md a celý docs/claude-review-prompt.md v otvorenom repozitári company-os. Vykonaj read-only review docs/specifikacia.md presne podľa tohto promptu a vráť výsledok do chatu v slovenčine. Súbory ani konfigurácie neupravuj.
```

Verejná dokumentácia obsahuje celé zadanie. Interné podklady a prevádzkové údaje autora nie sú súčasťou repozitára; možnosť opätovne použiť pôvodný kód zostáva neovereným bodom.
