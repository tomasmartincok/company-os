import { safeArchivePath, assertArchiveInventory } from './archive.mjs';

export const RELEASE_VERSION = '0.1.0-core.1';
export const RELEASE_TAG = `v${RELEASE_VERSION}`;
export const ARCHIVE_NAME = `company-os-core-${RELEASE_VERSION}.tar.gz`;
const base = `https://github.com/tomasmartincok/company-os/releases/download/${RELEASE_TAG}`;
const hash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value) && !/^0+$/.test(value);
export function validateReleaseManifest(manifest) {
  if (!manifest || manifest.format !== 'company-os-release-v1' || manifest.version !== RELEASE_VERSION || !/^[a-f0-9]{40}$/.test(manifest.sourceCommit) || /^0+$/.test(manifest.sourceCommit)) throw new Error('Invalid release identity');
  if (!manifest.archive || manifest.archive.name !== ARCHIVE_NAME || !hash(manifest.archive.sha256) || !Number.isSafeInteger(manifest.archive.bytes) || manifest.archive.bytes <= 0) throw new Error('Invalid archive pin');
  if (!Array.isArray(manifest.files) || !manifest.files.length) throw new Error('Missing inventory');
  const seen = new Set();
  for (const file of manifest.files) {
    safeArchivePath(file.path);
    if (seen.has(file.path) || !hash(file.sha256) || !Number.isSafeInteger(file.bytes) || file.bytes < 0) throw new Error('Invalid file inventory');
    seen.add(file.path);
  }
  assertArchiveInventory(manifest.files.map(file=>file.path));
  if (!seen.has('INSTALL.md') || !seen.has('core/installer.mjs')) throw new Error('Missing installer input');
  const runtime = manifest.runtime;
  if (runtime?.format !== 'company-os-node-pin-v1' || runtime.version !== '24.16.0' || runtime.supportedExistingNode !== '24.16.0' || !Array.isArray(runtime.artifacts) || runtime.artifacts.length !== 4) throw new Error('Invalid runtime pin');
  const platforms = new Set();
  for (const item of runtime.artifacts) {
    if (!/^(darwin|win)-(arm64|x64)$/.test(item.platform) || platforms.has(item.platform) || !hash(item.sha256) || item.url !== `https://nodejs.org/dist/v24.16.0/${item.name}`) throw new Error('Invalid runtime artifact');
    const dir = `node-v24.16.0-${item.platform}`;
    if (item.name !== `${dir}.${item.platform.startsWith('darwin') ? 'tar.gz' : 'zip'}` || item.executable !== `${dir}/${item.platform.startsWith('darwin') ? 'bin/node' : 'node.exe'}` || item.license !== `${dir}/LICENSE`) throw new Error('Invalid selected runtime member');
    platforms.add(item.platform);
  }
  if (!hash(runtime.provenance?.checksumsSha256) || !hash(runtime.provenance?.signatureSha256) || runtime.provenance?.validSignaturePrimaryFingerprint !== '5BE8A3F6C8A5C01D106C0AD820B1A390B168D356') throw new Error('Missing verified runtime provenance');
  return manifest;
}
export function renderMacCommands(manifest, manifestSha256) {
  validateReleaseManifest(manifest); if (!hash(manifestSha256)) throw new Error('Invalid manifest pin');
  const names = manifest.files.map(x=>x.path).sort();
  return `set -eu
umask 077
for tool in /usr/bin/curl /usr/bin/tar /usr/bin/shasum /usr/bin/awk /usr/bin/mktemp /bin/mkdir /bin/cp; do
  [ -x "$tool" ] || { printf '%s\\n' "STOP: missing $tool" >&2; exit 1; }
done
PHASE0_ROOT="$(/usr/bin/mktemp -d /private/tmp/company-os-phase0.XXXXXXXX)"
MANIFEST="$PHASE0_ROOT/manifest.json"
ARCHIVE="$PHASE0_ROOT/${ARCHIVE_NAME}"
/usr/bin/curl --fail --location --proto '=https' --proto-redir '=https' --tlsv1.2 --max-time 300 --silent --show-error '${base}/manifest.json' -o "$MANIFEST"
[ "$(/usr/bin/shasum -a 256 "$MANIFEST" | /usr/bin/awk '{print $1}')" = '${manifestSha256}' ] || { printf '%s\\n' 'STOP: manifest hash mismatch' >&2; exit 1; }
/usr/bin/curl --fail --location --proto '=https' --proto-redir '=https' --tlsv1.2 --max-time 300 --silent --show-error '${base}/${ARCHIVE_NAME}' -o "$ARCHIVE"
[ "$(/usr/bin/shasum -a 256 "$ARCHIVE" | /usr/bin/awk '{print $1}')" = '${manifest.archive.sha256}' ] || { printf '%s\\n' 'STOP: archive hash mismatch' >&2; exit 1; }
[ "$(/usr/bin/wc -c < "$ARCHIVE" | /usr/bin/awk '{print $1}')" = '${manifest.archive.bytes}' ] || { printf '%s\\n' 'STOP: archive size mismatch' >&2; exit 1; }
/bin/cat > "$PHASE0_ROOT/allowed.txt" <<'OS_ALLOWED'
${names.join('\n')}
OS_ALLOWED
/usr/bin/tar -tzf "$ARCHIVE" > "$PHASE0_ROOT/names.txt"
/usr/bin/awk 'NR==FNR {allow[$0]=1; total++; next} {if (!($0 in allow) || seen[$0]++) exit 1; count++} END {if (count != total) exit 1}' "$PHASE0_ROOT/allowed.txt" "$PHASE0_ROOT/names.txt" || { printf '%s\\n' 'STOP: unsafe or duplicate archive path' >&2; exit 1; }
/usr/bin/tar -tvzf "$ARCHIVE" > "$PHASE0_ROOT/types.txt"
/usr/bin/awk 'substr($0,1,1)!="-" {exit 1} {count++} END {if(count != ${names.length}) exit 1}' "$PHASE0_ROOT/types.txt" || { printf '%s\\n' 'STOP: archive links or special entries' >&2; exit 1; }
/bin/mkdir "$PHASE0_ROOT/verified"
/usr/bin/tar -xzf "$ARCHIVE" -C "$PHASE0_ROOT/verified" --no-same-owner --no-same-permissions
/bin/cat > "$PHASE0_ROOT/hashes.txt" <<'OS_HASHES'
${manifest.files.map(f=>`${f.sha256}  ${f.path}`).join('\n')}
OS_HASHES
(cd "$PHASE0_ROOT/verified" && /usr/bin/shasum -a 256 -c "$PHASE0_ROOT/hashes.txt")
/bin/cp "$MANIFEST" "$PHASE0_ROOT/verified/release-manifest.json"
printf 'VERIFIED_STAGE=%s\\n' "$PHASE0_ROOT/verified"`;
}
const ps = text => `'${String(text).replaceAll("'", "''")}'`;
export function renderWindowsCommands(manifest, manifestSha256) {
  validateReleaseManifest(manifest); if (!hash(manifestSha256)) throw new Error('Invalid manifest pin');
  return `$ErrorActionPreference = 'Stop'
if (-not [Environment]::Is64BitProcess) { throw 'STOP: use a 64-bit/ARM64 PowerShell host' }
Get-ExecutionPolicy -List
$PSVersionTable
$System32 = Join-Path ([Environment]::GetFolderPath('Windows')) 'System32'
$Curl = Join-Path $System32 'curl.exe'
$Tar = Join-Path $System32 'tar.exe'
$Certutil = Join-Path $System32 'certutil.exe'
foreach ($Tool in @($Curl, $Tar, $Certutil)) { if (-not [IO.File]::Exists($Tool)) { throw "STOP: missing $Tool" } }
function Read-NativeSha256([string]$File) {
  $Lines = @(& $Certutil -hashfile $File SHA256)
  if ($LASTEXITCODE -ne 0) { throw 'STOP: certutil failed' }
  $Digests = @($Lines | ForEach-Object { $_ -replace '\\s','' } | Where-Object { $_ -match '^[a-fA-F0-9]{64}$' })
  if ($Digests.Count -ne 1) { throw 'STOP: ambiguous certutil digest' }
  return $Digests[0].ToLowerInvariant()
}
$Local = [IO.Path]::GetFullPath([Environment]::GetFolderPath('LocalApplicationData'))
if ($Local.StartsWith('\\\\')) { throw 'STOP: local staging must not be a network share' }
$Ancestor = $Local
while ($Ancestor) {
  if ([IO.Directory]::Exists($Ancestor) -and (([IO.File]::GetAttributes($Ancestor) -band [IO.FileAttributes]::ReparsePoint) -ne 0)) { throw 'STOP: staging ancestor is a reparse point' }
  $Parent = [IO.Directory]::GetParent($Ancestor)
  if ($null -eq $Parent) { break }
  $Ancestor = $Parent.FullName
}
$Stage = Join-Path $Local ('company-os-phase0-' + [Guid]::NewGuid().ToString('N'))
if ([IO.Directory]::Exists($Stage) -or [IO.File]::Exists($Stage)) { throw 'STOP: stage exists' }
[void][IO.Directory]::CreateDirectory($Stage)
$Manifest = Join-Path $Stage 'manifest.json'
$Archive = Join-Path $Stage ${ps(ARCHIVE_NAME)}
& $Curl --fail --location --proto '=https' --proto-redir '=https' --tlsv1.2 --max-time 300 --silent --show-error ${ps(base+'/manifest.json')} -o $Manifest
if ($LASTEXITCODE -ne 0) { throw 'STOP: manifest download failed' }
if ((Read-NativeSha256 $Manifest) -cne ${ps(manifestSha256)}) { throw 'STOP: manifest hash mismatch' }
& $Curl --fail --location --proto '=https' --proto-redir '=https' --tlsv1.2 --max-time 300 --silent --show-error ${ps(base+'/'+ARCHIVE_NAME)} -o $Archive
if ($LASTEXITCODE -ne 0) { throw 'STOP: archive download failed' }
if ((Read-NativeSha256 $Archive) -cne ${ps(manifest.archive.sha256)}) { throw 'STOP: archive hash mismatch' }
if (([IO.FileInfo]$Archive).Length -ne ${manifest.archive.bytes}) { throw 'STOP: archive size mismatch' }
$Allowed = @(${manifest.files.map(f=>ps(f.path)).join(', ')})
$Names = @(& $Tar -tzf $Archive)
if ($LASTEXITCODE -ne 0 -or $Names.Count -ne $Allowed.Count) { throw 'STOP: archive listing failed' }
$Seen = @{}
foreach ($Name in $Names) {
  if (-not ($Allowed -ccontains $Name) -or $Seen.ContainsKey($Name)) { throw 'STOP: unsafe or duplicate archive path' }
  $Seen[$Name] = $true
}
$Types = @(& $Tar -tvzf $Archive)
if ($LASTEXITCODE -ne 0 -or $Types.Count -ne $Allowed.Count) { throw 'STOP: archive type listing failed' }
foreach ($Line in $Types) { if (-not $Line.StartsWith('-')) { throw 'STOP: archive links or special entries' } }
$Verified = Join-Path $Stage 'verified'
[void][IO.Directory]::CreateDirectory($Verified)
& $Tar -xzf $Archive -C $Verified --no-same-owner --no-same-permissions
if ($LASTEXITCODE -ne 0) { throw 'STOP: extract failed' }
$Files = @(
${manifest.files.map(f=>`  @{ Path=${ps(f.path)}; Sha=${ps(f.sha256)}; Bytes=${f.bytes} }`).join(',\n')}
)
foreach ($File in $Files) {
  $Path = Join-Path $Verified $File.Path
  if (-not [IO.File]::Exists($Path) -or ([IO.FileInfo]$Path).Length -ne $File.Bytes -or (Read-NativeSha256 $Path) -cne $File.Sha) { throw 'STOP: extracted file mismatch' }
}
Copy-Item -LiteralPath $Manifest -Destination (Join-Path $Verified 'release-manifest.json')
Write-Output ('VERIFIED_STAGE=' + $Verified)`;
}
export function renderBootstrap(manifest, manifestSha256, template) {
  const tokens = { SOURCE_COMMIT:manifest.sourceCommit, VERSION:manifest.version, MANIFEST_SHA256:manifestSha256, MAC_COMMANDS:renderMacCommands(manifest, manifestSha256), WINDOWS_COMMANDS:renderWindowsCommands(manifest, manifestSha256) };
  const output = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, name) => { if (!(name in tokens)) throw new Error(`Unknown template token ${name}`); return tokens[name]; });
  if (/\{\{[^}]+\}\}/.test(output)) throw new Error('Unresolved bootstrap token');
  return output;
}
