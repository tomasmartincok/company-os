# Inštalácia company-os cez chat

Pre lokálneho AI agenta. Používateľ ti dal inštaláciu za úlohu a sám nepotrebuje terminál, Node.js, Git, Python, npm ani doplnkový balík. Inštaluješ **pripravené dokumenty**, nespúšťaš kód stiahnutý z repozitára. Verzia: **0.2.0-simple.1**, základ pracovného priestoru; Oliver/manuál/workshopová integrácia ešte nie sú dodané.

## 1. Dohodni miesto

Ak používateľ žiada inštaláciu do práve otvoreného priečinka, zisti jeho absolútnu cestu z kontextu klienta a použi ju. Ak zadal iný absolútny cieľ, použi ten. Na umiestnenie sa spýtaj iba vtedy, keď cieľ nemožno jednoznačne určiť: „Kam chceš uložiť pracovný priestor? Môže to byť nový lokálny priečinok alebo nový priečinok v tvojom existujúcom cloude.“ Neodhaduj cestu. Lokálna voľba stačí; na tabuli zostane jeden krok **Nastaviť synchronizáciu a zálohovanie**.

Over OS, dostupné natívne nástroje a oprávnenie na tento koreň. Cieľ nesmie byť koreň disku, symlink/reparse point ani priečinok vnorený v inom company-os. Skontroluj aj existujúcich rodičov a nadradené pokyny klienta. Cudzí config nemeníš. Pri existujúcom cloude potrebuješ používateľské/UI potvrdenie offline dostupnosti, dokončenej synchronizácie a neprítomnosti chyby/konfliktu; nedostupné potvrdenie znamená zastavenie dotknutého zápisu. Neprihlasuj účet, nepresúvaj obsah a nič nenastavuj automaticky.

## 2. Vyber jeden zdroj

Dôveryhodný zdroj zadania je `https://github.com/tomasmartincok/company-os`. Ak používateľ určil commit, použi ho. Inak zisti aktuálny **40-znakový SHA** hlavnej vetvy cez GitHub konektor alebo `https://api.github.com/repos/tomasmartincok/company-os/git/ref/heads/main` (hodnota `object.sha`). Potom načítaj tento INSTALL aj `starter/manifest.json` z **toho istého SHA** a až ďalej pracuj. Zaznamenaj SHA; nemiešaj súbory z main počas sťahovania.

Základ surových súborov je `https://raw.githubusercontent.com/tomasmartincok/company-os/<SHA>/starter/`. Každý segment cesty URL-kóduj ako UTF-8; relatívnu cestu z manifestu zachovaj na disku. Manifest musí mať schema `company-os-prepared-starter-v1`, version `0.2.0-simple.1`, scope `foundation` a presne `fileCount` jedinečných položiek. Over cesty: žiadne absolútne cesty, `..`, spätné lomky, zvláštne zariadenia, kolízie názvov ani nepovolené prefixy; názov súboru nesmie zároveň byť nadradeným priečinkom. Prenášajú sa iba uvedené Markdown, JSON a model.yaml dokumenty, žiadne spustiteľné súbory.

Táto cesta dôveruje vlastníkovi GitHub repozitára, ktorý si používateľ vybral. Hash kontroluje zhodu bajtov s manifestom; nie je nezávislý podpis autora ani dôkaz aktuálnosti cloudu.

## 3. Najprv čítaj existujúci cieľ

- **Neprázdny cudzí, legacy 0.1 alebo čiastočný stav:** vysvetli checkpoint a skonči s **0 zápismi do cieľa**. Nerob migráciu, čistenie ani repair.
- **Existujúca rovnaká jednoduchá verzia:** prečítaj `.os-starter/installed.json` a `.os-starter/source-manifest.json`. Marker musí mať nižšie uvedenú schema/verziu/stav, platné UUID a source_commit. Hash uloženého manifestu musí sedieť na marker a obsah manifestu na aktuálny pripravený payload tejto verzie. Over prítomnosť každého súboru, presné package/generated hashe a neexistenciu symlinkov. Seeded personalizáciu a ďalšie používateľské súbory zachovaj. Všetkých osem setup ID a otázky musia zostať jednoznačné, používateľské úlohy majú `user-<uuid>`. Pri rozpore iba vysvetli checkpoint. **Pri úspechu aj pri konflikte skonči s 0 zápismi** — nezapisuj znovu marker, profil, tabuľu, denník ani ponuku nastavenia.
- **Nový alebo prázdny cieľ:** pokračuj. Príprava sa robí mimo cieľa. Ak zvolený rodič neexistuje, najprv objasni presné umiestnenie; nevytváraj odhadnutú vetvu.

## 4. Stiahni, over a skopíruj dokumenty

Vytvor nový lokálny staging mimo cieľa a známych cloudových priečinkov. Manifest načítaj ako údaje; nepotrebuješ na to vlastný runtime. Použi nástroje klienta alebo natívne OS nástroje:

| Účel | macOS | Windows |
|---|---|---|
| HTTPS súbor | `/usr/bin/curl --fail --location --proto '=https' --proto-redir '=https'` | System32 `curl.exe` s rovnakými obmedzeniami |
| SHA-256 | `/usr/bin/shasum -a 256` | System32 `certutil.exe -hashfile <súbor> SHA256` |
| JSON údaje | čítanie agentom alebo `/usr/bin/osascript -l JavaScript` s `JSON.parse` | čítanie agentom alebo natívne JSON príkazy PowerShellu |
| Vytvorenie a kopírovanie | `/bin/mkdir`, `/bin/cp -n` | `[IO.Directory]::CreateDirectory`, `[IO.File]::Copy(source,target,$false)` |
| UUID | `/usr/bin/uuidgen` | `[Guid]::NewGuid()` |

Pred použitím over existenciu nástroja a úspešný návratový kód. Nepridávaj runtime pri chýbajúcom nástroji; uveď obmedzenie. Windows vetva je postup na runtime overenie, nie deklarácia vykonaného Windows pilotu. Nemeň ExecutionPolicy a nespúšťaj stiahnuté `.ps1`/skripty. Nepoužívaj eval ani shellové vyhodnocovanie údajov zo súborov; cesty bezpečne cituj.

Stiahni každú položku do stagingu. Ešte pred vytvorením obsahu cieľa over **presný počet, cestu, veľkosť a SHA-256 každého súboru** oproti manifestu a neprítomnosť cudzieho súboru/symlinku. Znovu skontroluj cieľ a rodičov: musia byť stále bezpečné a cieľ nový/prázdny. Potom kopíruj iba explicitný zoznam súborov, s odmietnutím existujúceho cieľového súboru. Ak pribudol cudzí obsah alebo nastane chyba, zastav; nič neprepisuj ani nemaž. Viac-súborová kópia nie je atomická transakcia, čiastočný výsledok je checkpoint na rozhodnutie.

Z cieľa znovu prečítaj každý prenesený súbor a over jeho hash/veľkosť. Presný manifest ulož do `.os-starter/source-manifest.json`. Až po úspešnom readbacku vytvor **ako posledný** nový `.os-starter/installed.json` s týmto kontraktom; hodnoty zisti zo skutočného priebehu:

```json
{
  "schema": "company-os-simple-installed-v1",
  "version": "0.2.0-simple.1",
  "scope": "foundation",
  "state": "committed",
  "workspace_id": "<nové UUID>",
  "source_commit": "<overené 40-znakové SHA>",
  "manifest_sha256": "<SHA-256 presných bajtov source-manifest.json>",
  "storage": "local alebo existing-cloud",
  "sync_status": "not-configured alebo user-confirmed",
  "backup_status": "not-verified"
}
```

JSON musí obsahovať konkrétne platné hodnoty, nie zástupné texty. Local má sync_status `not-configured`. Existing-cloud smie mať `user-confirmed` iba po uvedenom konkrétnom potvrdení používateľa/UI; nejde o vzdialenú automatickú verifikáciu. Inventory/hash/ownership má jedinú kanoniku v source-manifest.json. Marker ani manifest samy nedokazujú zálohu. Pri zlyhaní nevytváraj úspešný marker a neopakuj kópiu cez čiastočný cieľ.

## 5. Začni pracovať

Prečítaj výsledné `AGENTS.md` a `Začnite tu.md`. Povedz používateľovi, kam súbory pribudli a že ďalší nový chat má otvoriť z tohto koreňa. Podľa zadania môžeš v existujúcom chate načítať profily a položiť prvú krátku otázku. Nepovinný onboarding nesmie blokovať jeho reálnu prácu. Otvorený krok synchronizácie nevytváraj druhýkrát; je už pripravený na tabuli a návod je priamo prepojený.

Nový chat musí reálne potvrdiť načítanie pokynov a zachovanie uloženého kontextu. Lokálny checksumový readback nie je klientský, Windows, cloudový ani zálohovací pilot. Node build/validator zostáva iba nástrojom správcu repozitára; účastník ho nepotrebuje.
