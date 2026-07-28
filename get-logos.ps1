# ================================================================
# IntegralTech Official Logo Downloader
# ================================================================
# Run in your terminal (not through the AI agent):
#   powershell -ExecutionPolicy Bypass -File ".\get-logos.ps1"
# ================================================================

$dst = Join-Path $PSScriptRoot "public\solutions"
if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Force -Path $dst | Out-Null }

Write-Host "`n=== IntegralTech Logo Downloader ===" -ForegroundColor Cyan
Write-Host "Target: $dst`n"

$logos = [ordered]@{
  "integraltech-business-logo.png"      = "https://integraltech.ma/storage/logo-business-320x240.png"
  "integraltech-factory-logo.png"       = "https://integraltech.ma/storage/logo-factory-320x240.png"
  "integraltech-materio-logo.png"       = "https://integraltech.ma/storage/logo-materio-320x240.png"
  "integraltech-tms-logo.png"           = "https://integraltech.ma/storage/logo-tms-320x240.png"
  "integraltech-marche-logo.png"        = "https://integraltech.ma/storage/logo-marche-320x240.png"
  "integraltech-zbtp-logo.png"          = "https://integraltech.ma/storage/logo-zbtp-320x240.png"
  "integraltech-finance-logo.png"       = "https://integraltech.ma/storage/logo-finance-1-320x240.png"
  "integraltech-finance-plus-logo.png"  = "https://integraltech.ma/storage/logo-finance-320x240.png"
  "integraltech-edu-logo.png"           = "https://integraltech.ma/storage/edu-1-320x240.png"
}

$ok = 0; $fail = 0

foreach ($entry in $logos.GetEnumerator()) {
  $outFile = Join-Path $dst $entry.Key
  $url = $entry.Value
  Write-Host ("[{0}/9] {1}" -f ($ok + $fail + 1), $entry.Key) -NoNewline
  try {
    Invoke-WebRequest -Uri $url -OutFile $outFile -UseBasicParsing -ErrorAction Stop
    $info = Get-Item $outFile
    if ($info.Length -lt 500) {
      Write-Host ("  WARN: too small ({0} bytes)" -f $info.Length) -ForegroundColor Yellow
      $fail++
    } else {
      Write-Host ("  OK  ({0:N0} bytes)" -f $info.Length) -ForegroundColor Green
      $ok++
    }
  } catch {
    Write-Host ("  FAIL: {0}" -f $_.Exception.Message) -ForegroundColor Red
    $fail++
  }
}

Write-Host "`n=== Results: $ok succeeded, $fail failed ===" -ForegroundColor Cyan
Write-Host ""
Get-ChildItem $dst -Filter "*.png" | Select-Object Name, Length | Format-Table -AutoSize
