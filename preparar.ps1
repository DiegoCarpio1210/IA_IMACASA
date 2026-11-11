$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (Test-Path -LiteralPath '.env') {
    Write-Host 'Ya existe .env. Se conservaron las credenciales existentes.'
    exit 0
}
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$apiBytes = New-Object byte[] 20
$rng.GetBytes($apiBytes)
$demoApi = [BitConverter]::ToString($apiBytes).Replace('-', '').ToLower()
$rng.Dispose()
@("API_TOKEN=$demoApi", 'UI_USER=pimientero', 'UI_PASSWORD=') | Set-Content -LiteralPath '.env' -Encoding ascii
Write-Host 'Token API creado en .env. Crea la primera cuenta con python -m app.manage create-user (ver README).'
Write-Host 'No publiques .env. El token de la API y la clave de la interfaz son diferentes.'
