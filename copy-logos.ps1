$src = "$env:USERPROFILE\Downloads"
$dst = "c:\Users\deLL\Downloads\integraltech-frontend\public\solutions"

if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Force -Path $dst | Out-Null }

$map = @(
  @("logo-business-320x240.png",    "integraltech-business-logo.png"),
  @("logo-factory-320x240.png",     "integraltech-factory-logo.png"),
  @("logo-materio-320x240.png",     "integraltech-materio-logo.png"),
  @("logo-tms-320x240.png",         "integraltech-tms-logo.png"),
  @("logo-marche-320x240.png",      "integraltech-marche-logo.png"),
  @("logo-zbtp-320x240.png",        "integraltech-zbtp-logo.png"),
  @("logo-finance-1-320x240.png",   "integraltech-finance-logo.png"),
  @("logo-finance-320x240.png",     "integraltech-finance-plus-logo.png"),
  @("edu-1-320x240.png",            "integraltech-edu-logo.png")
)

foreach($m in $map) {
  $source = Join-Path $src $m[0]
  $target = Join-Path $dst $m[1]
  if (Test-Path $source) {
    Copy-Item -Path $source -Destination $target -Force
    $size = (Get-Item $target).Length
    Write-Host "OK: $($m[1]) ($size bytes)"
  } else {
    Write-Host "MISSING: $($m[0]) not found in Downloads"
  }
}

Write-Host "`nFiles in $dst :"
Get-ChildItem $dst -Filter "*.png" | ForEach-Object { Write-Host "  $($_.Name) ($($_.Length) bytes)" }
