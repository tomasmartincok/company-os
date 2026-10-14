# INSTALL — overený technický základ company-os

Tento dokument sa číta až po natívnej Fáze 0 a výsledku VERIFIED_STAGE. Nie je pôvodom dôvery pre svoj vlastný archív. Použi iba vypísaný overený staging a zachovaj priložený release-manifest.json.

## 1. Cieľ a preflight

S používateľom potvrď absolútny cieľ, OS/klienta, synchronizované úložisko a offline dostupnosť. Cieľ musí byť nový alebo už spravovaný rovnakým základom. Nevyberaj priečinok podľa odhadu a nemiešaj jeho existujúce súbory. Skontroluj relevantné nadradené aj osobné pokyny klienta; konflikt pomenuj, cudzie nastavenia neprepisuj. Staging aj runtime musia zostať mimo všetkých známych synchronizovaných koreňov. Pri Fáze 0 zachovaj výsledok native hashov a skutočný shell; Windows zdrojová kontrola nie je Windows pilot.

## 2. Lokálny runtime

Podporovaná účastnícka existujúca verzia je presne Node.js v24.16.0; over jej absolútnu cestu a --version. Ak je dostupná, použi ju bez globálnej zmeny. Vývojové testy na novšom Node nezvyšujú automaticky podporovaný rozsah. Ak chýba, priprav pinovaný oficiálny runtime nasledujúcimi natívnymi príkazmi. Obsah checksum dokumentu bol podpisovo overený správcom; podrobnosti a štyri artefakty sú v content/runtime/node-24.16.0.json a release manifestoch. Nepotrebuješ GPG, npm, Git, Python ani globálnu inštaláciu.

Celý oficiálny archív sa overí hashom. Rozbalia sa iba dva presne pomenované bežné súbory: node executable a LICENSE. Ostatné členy vrátane npm symlinkov zostávajú nerozbalené. Licenciu zachovaj pri runtime.

### macOS

```sh
set -eu
umask 077
case "$(/usr/bin/uname -m)" in
  arm64) RT_URL='https://nodejs.org/dist/v24.16.0/node-v24.16.0-darwin-arm64.tar.gz'; RT_HASH='39189dab4eeb15706c424af0ac08a3044c9e48f7db12a7d77f6b7aafc7dd5df6'; NODE_MEMBER='node-v24.16.0-darwin-arm64/bin/node'; LICENSE_MEMBER='node-v24.16.0-darwin-arm64/LICENSE' ;;
  x86_64) RT_URL='https://nodejs.org/dist/v24.16.0/node-v24.16.0-darwin-x64.tar.gz'; RT_HASH='298b4c7b3cb80765c8703e42b90324a4ece3b6634947b89e769c3c980ab55185'; NODE_MEMBER='node-v24.16.0-darwin-x64/bin/node'; LICENSE_MEMBER='node-v24.16.0-darwin-x64/LICENSE' ;;
  *) printf '%s\n' 'STOP: unsupported native Mac architecture' >&2; exit 1 ;;
esac
RT_ROOT="$(/usr/bin/mktemp -d /private/tmp/company-os-runtime.XXXXXXXX)"
RT_ARCHIVE="$RT_ROOT/node.tar.gz"
/usr/bin/curl --fail --location --proto '=https' --proto-redir '=https' --tlsv1.2 --max-time 600 --silent --show-error "$RT_URL" -o "$RT_ARCHIVE"
[ "$(/usr/bin/shasum -a 256 "$RT_ARCHIVE" | /usr/bin/awk '{print $1}')" = "$RT_HASH" ] || { printf '%s\n' 'STOP: runtime hash mismatch' >&2; exit 1; }
# Only these two literal members are listed/extracted. npm symlinks and all other members are never extracted.
/usr/bin/tar -tzf "$RT_ARCHIVE" "$NODE_MEMBER" "$LICENSE_MEMBER" > "$RT_ROOT/names.txt"
printf '%s\n%s\n' "$NODE_MEMBER" "$LICENSE_MEMBER" > "$RT_ROOT/allowed.txt"
/usr/bin/awk 'NR==FNR {allow[$0]=1;total++;next} {if(!($0 in allow)||seen[$0]++)exit 1;count++} END {if(count!=total)exit 1}' "$RT_ROOT/allowed.txt" "$RT_ROOT/names.txt" || { printf '%s\n' 'STOP: selected runtime paths' >&2; exit 1; }
/usr/bin/tar -tvzf "$RT_ARCHIVE" "$NODE_MEMBER" "$LICENSE_MEMBER" > "$RT_ROOT/types.txt"
/usr/bin/awk 'substr($0,1,1)!="-" {exit 1} {count++} END {if(count!=2)exit 1}' "$RT_ROOT/types.txt" || { printf '%s\n' 'STOP: selected runtime types' >&2; exit 1; }
/bin/mkdir "$RT_ROOT/verified"
/usr/bin/tar -xzf "$RT_ARCHIVE" -C "$RT_ROOT/verified" --no-same-owner --no-same-permissions "$NODE_MEMBER" "$LICENSE_MEMBER"
NODE_EXEC="$RT_ROOT/verified/$NODE_MEMBER"
[ "$("$NODE_EXEC" --version)" = 'v24.16.0' ] || { printf '%s\n' 'STOP: unexpected runtime version' >&2; exit 1; }
printf 'NODE_EXEC=%s\n' "$NODE_EXEC"
```

### Windows

Skutočný runtime a politika Windows: NOT TESTED. Native vetva používa iba System32 nástroje a interaktívne príkazy; žiadny downloaded ps1 ani zmena ExecutionPolicy.

```powershell
$ErrorActionPreference = 'Stop'
if (-not [Environment]::Is64BitProcess) { throw 'STOP: use a 64-bit/ARM64 host' }
$NativeArchitecture = if ($env:PROCESSOR_ARCHITEW6432) { $env:PROCESSOR_ARCHITEW6432 } else { $env:PROCESSOR_ARCHITECTURE }
switch ($NativeArchitecture) {
  'ARM64' { $Url='https://nodejs.org/dist/v24.16.0/node-v24.16.0-win-arm64.zip'; $Hash='14834611d4c6b3c06054e7007732b90474c16e0b32f395e05b55a571ef71c6d2'; $NodeMember='node-v24.16.0-win-arm64/node.exe'; $LicenseMember='node-v24.16.0-win-arm64/LICENSE' }
  'AMD64' { $Url='https://nodejs.org/dist/v24.16.0/node-v24.16.0-win-x64.zip'; $Hash='edaca9bd58ec8e92037dac4e877d52f6b8f430b81c18b57e264b4e2fb111cd56'; $NodeMember='node-v24.16.0-win-x64/node.exe'; $LicenseMember='node-v24.16.0-win-x64/LICENSE' }
  default { throw 'STOP: unsupported Windows architecture' }
}
$System32 = Join-Path ([Environment]::GetFolderPath('Windows')) 'System32'
$Curl = Join-Path $System32 'curl.exe'; $Tar = Join-Path $System32 'tar.exe'; $Certutil = Join-Path $System32 'certutil.exe'
foreach ($Tool in @($Curl,$Tar,$Certutil)) { if (-not [IO.File]::Exists($Tool)) { throw 'STOP: native runtime tool missing' } }
$Local = [IO.Path]::GetFullPath([Environment]::GetFolderPath('LocalApplicationData'))
if ($Local.StartsWith('\\')) { throw 'STOP: runtime must be local' }
$Ancestor = $Local
while ($Ancestor) {
  if ([IO.Directory]::Exists($Ancestor) -and (([IO.File]::GetAttributes($Ancestor) -band [IO.FileAttributes]::ReparsePoint) -ne 0)) { throw 'STOP: runtime ancestor is a reparse point' }
  $Parent = [IO.Directory]::GetParent($Ancestor); if ($null -eq $Parent) { break }; $Ancestor = $Parent.FullName
}
$Runtime = Join-Path $Local ('company-os-runtime-' + [Guid]::NewGuid().ToString('N'))
if ([IO.Directory]::Exists($Runtime) -or [IO.File]::Exists($Runtime)) { throw 'STOP: runtime exists' }
[void][IO.Directory]::CreateDirectory($Runtime)
$Archive = Join-Path $Runtime 'node.zip'
& $Curl --fail --location --proto '=https' --proto-redir '=https' --tlsv1.2 --max-time 600 --silent --show-error $Url -o $Archive
if ($LASTEXITCODE -ne 0) { throw 'STOP: runtime download failed' }
$Lines = @(& $Certutil -hashfile $Archive SHA256)
if ($LASTEXITCODE -ne 0) { throw 'STOP: runtime certutil failed' }
$Digests = @($Lines | ForEach-Object { $_ -replace '\s','' } | Where-Object { $_ -match '^[a-fA-F0-9]{64}$' })
if ($Digests.Count -ne 1 -or $Digests[0].ToLowerInvariant() -cne $Hash) { throw 'STOP: runtime hash mismatch' }
$Allowed = @($NodeMember,$LicenseMember)
$Names = @(& $Tar -tf $Archive $NodeMember $LicenseMember)
if ($LASTEXITCODE -ne 0 -or $Names.Count -ne 2 -or $Names[0] -ceq $Names[1]) { throw 'STOP: runtime member listing failed' }
foreach ($Name in $Names) { if (-not ($Allowed -ccontains $Name)) { throw 'STOP: unexpected selected runtime member' } }
$Types = @(& $Tar -tvf $Archive $NodeMember $LicenseMember)
if ($LASTEXITCODE -ne 0 -or $Types.Count -ne 2) { throw 'STOP: runtime type listing failed' }
foreach ($Line in $Types) { if (-not $Line.StartsWith('-')) { throw 'STOP: selected runtime links/special entries' } }
$Verified = Join-Path $Runtime 'verified'; [void][IO.Directory]::CreateDirectory($Verified)
& $Tar -xf $Archive -C $Verified --no-same-owner --no-same-permissions $NodeMember $LicenseMember
if ($LASTEXITCODE -ne 0) { throw 'STOP: selected runtime extraction failed' }
$NodeExec = Join-Path $Verified $NodeMember
$Version = & $NodeExec --version
if ($LASTEXITCODE -ne 0 -or $Version -cne 'v24.16.0') { throw 'STOP: unexpected runtime version' }
Write-Output ('NODE_EXEC=' + $NodeExec)
```

## 3. Apply a verify

AI klient vykoná príkazy, človek ich nemusí ručne písať. Hodnoty čerpaj zo skutočne overených absolútnych ciest, správne ich cituj podľa shellu a nevkladaj ich do eval. Nasledujúce zápisy sú vysvetlenie CLI argumentov, nie pripravený literal s tajne odhadnutým cieľom:

- preflight: pinovaný-node core/installer.mjs preflight --target absolútny-cieľ --bundle overený-staging
- apply: pinovaný-node core/installer.mjs apply --target absolútny-cieľ --bundle overený-staging
- verify: pinovaný-node core/installer.mjs verify --target absolútny-cieľ

Použi plnú cestu k core/installer.mjs v overenom stagingu. Distribuovaný apply vždy používa --bundle; jeho vynechanie je interný maintainer source režim. Rozsah oprávnení pred apply potvrdzuje zadaná inštalácia, UI klient môže vyžadovať svoje schválenie. Pri neúspešnom preflight/apply nepokračuj automaticky v inom cieli. Retry tej istej verzie má zachovať používateľské profily, tabuľu aj poznámky. Po apply urob verify, prečítaj výsledné Začnite tu.md a skontroluj uložené súbory.

## 4. Nový chat a hranice dodávky

Otvor nový chat zo skutočného koreňa pracovného priestoru. Požiadaj klienta: „Prečítaj AGENTS.md, Prehľad firmy.md, O mne.md, Mapa systému.md a relevantnú časť Pracovná tabuľa.md. Uveď, ktoré pokyny si načítal, čo je pripravené a čo je ešte otvorené.“ CLAUDE.md import je iba technický adaptér; skutočné načítanie a vplyv nadradených pokynov musí potvrdiť klient.

Tento prvý celok nie je hotová workshopová inštalácia. Oliver, ďalšie dva štartovacie procesy, generovaný manuál, discovery adaptéry a prepojenie účastníckych materiálov sa dodajú ďalším celkom. Ich úlohy zostávajú otvorené. Existencia AGENTS súboru nie je dôkaz samostatného vyvolania Olivera. Synchronizačné konflikty, aktualizačné transakcie, rollback a Windows/full pilot sa neoznačujú za dodané v tomto release.
