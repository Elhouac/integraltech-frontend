$dir = "c:\Users\deLL\Downloads\integraltech-frontend\public\solutions"
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }

$urls = @(
  @("https://integraltech.ma/storage/logo-business-320x240.png", "integraltech-business-logo.png"),
  @("https://integraltech.ma/storage/logo-factory-320x240.png", "integraltech-factory-logo.png"),
  @("https://integraltech.ma/storage/logo-materio-320x240.png", "integraltech-materio-logo.png"),
  @("https://integraltech.ma/storage/logo-tms-320x240.png", "integraltech-tms-logo.png"),
  @("https://integraltech.ma/storage/logo-marche-320x240.png", "integraltech-marche-logo.png"),
  @("https://integraltech.ma/storage/logo-zbtp-320x240.png", "integraltech-zbtp-logo.png"),
  @("https://integraltech.ma/storage/logo-finance-1-320x240.png", "integraltech-finance-logo.png"),
  @("https://integraltech.ma/storage/logo-finance-320x240.png", "integraltech-finance-plus-logo.png"),
  @("https://integraltech.ma/storage/edu-1-320x240.png", "integraltech-edu-logo.png")
)

foreach($u in $urls) {
  $out = Join-Path $dir $u[1]
  try {
    Invoke-WebRequest -Uri $u[0] -OutFile $out -UseBasicParsing
    $size = (Get-Item $out).Length
    Write-Host "OK: $($u[1]) ($size bytes)"
  } catch {
    Write-Host "FAIL: $($u[1]) - $($_.Exception.Message)"
  }
}

Write-Host "`nDone. Files in directory:"
Get-ChildItem $dir | ForEach-Object { Write-Host "  $($_.Name) ($($_.Length) bytes)" }
