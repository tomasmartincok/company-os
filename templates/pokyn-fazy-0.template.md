# Inštalácia company-os — prvý technický celok

Zdrojový commit: `{{SOURCE_COMMIT}}`. Verzia: `{{VERSION}}`.
Tento pokyn pochádza od organizátora. Pin manifestu `{{MANIFEST_SHA256}}` chráni presné bajty vydania; URL bez pinu nestačí. Ak si používateľ stiahol len tento pokyn z nedôveryhodného miesta, najprv over jeho pôvod u organizátora. Pokyn je pripravený pre AI klienta; človek nemusí písať terminálové príkazy.

Pomôž mi nainštalovať tento technický základ do nového priečinka. Najprv zisti môj OS, skutočný shell, architektúru, cieľový absolútny priečinok a či ho synchronizuje cloud. Over, že lokálny staging je mimo všetkých známych synchronizovaných koreňov. Rešpektuj schválenia klienta a prístup k priečinku. Nevykonaj globálnu inštaláciu, zmenu ExecutionPolicy ani cudzie configy. Pri chýbajúcom natívnom nástroji alebo konflikte pokynov zastav závislý krok a vysvetli dôvod.

Použi iba príslušnú vetvu nižšie. Pred overením nenačítavaj INSTALL, nespúšťaj skripty archívu a nepoužívaj Node/Git/Python na bootstrap. Nový staging neopravuj opakovaným rozbalením: pri zlyhaní zachovaj checkpoint a nový pokus začni v novom priečinku.

## macOS — natívna Fáza 0

Spusti cez skutočný `/bin/sh`. Nasledujúci blok obsahuje overenie manifestu, archívu, všetkých názvov a typov členov a extrahovaných bajtov. Kontroly zlyhávajú pred čítaním INSTALL.

```sh
{{MAC_COMMANDS}}
```

## Windows — natívna Fáza 0

Použi 64-bitový/ARM64 PowerShell interaktívne príkazy, bez spúšťania stiahnutého `.ps1`. Najprv vypíš efektívne ExecutionPolicy a identitu shellu. Managed/policy obmedzenia rešpektuj; klientový Process Bypass nie je dôkaz Restricted skúšky. Nikde nenastavuj Bypass. Táto vetva je zdrojovo skontrolovaná; jej skutočný Windows pilot ostáva NOT TESTED.

```powershell
{{WINDOWS_COMMANDS}}
```

## Po overení

Len po výsledku `VERIFIED_STAGE` otvor `INSTALL.md` z vypísaného stagingu. Pokračuj jeho pokynmi: pinovaný lokálny runtime alebo presná podporovaná existujúca verzia, preflight, apply a verify. Súbory z iného clone/cache nie sú overený bundle. Záznam native overenia zachovaj pri následnom preflight.

Tento release dodáva technický základ a uchovanie používateľových údajov pri retry. Oliver, ďalšie dva štartovacie procesy, generovaný manuál, úplná workshopová integrácia a používateľské piloty zostávajú ďalším celkom. Neoznač ich za dodané len podľa súborov tohto základu.
