# Fetch a URL into _raw/<slug>/ and log the attempt to _raw/fetch_log.tsv.
# Raw downloads are third-party material: they stay gitignored and are never redistributed.
param(
    [Parameter(Mandatory = $true)][string]$Url,
    [Parameter(Mandatory = $true)][string]$Slug,
    [Parameter(Mandatory = $true)][string]$FileName
)
$root = Split-Path -Parent $PSScriptRoot
$dir = Join-Path $root "_raw\$Slug"
New-Item -ItemType Directory -Force $dir | Out-Null
$out = Join-Path $dir $FileName
$meta = curl.exe -sS -L --max-time 90 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) IGNIS-research" `
    -o $out -w "%{http_code}`t%{content_type}`t%{size_download}`t%{url_effective}" $Url
$stamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$hash = if (Test-Path $out) { (Get-FileHash -Algorithm SHA256 $out).Hash.ToLower() } else { "" }
$line = "$stamp`t$Url`t$Slug/$FileName`t$meta`t$hash"
Add-Content -Path (Join-Path $root "_raw\fetch_log.tsv") -Value $line -Encoding utf8
$line
