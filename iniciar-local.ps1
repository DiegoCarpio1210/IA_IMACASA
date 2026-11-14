$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
& "$PSScriptRoot\preparar.ps1"
$config = @{}
Get-Content -LiteralPath '.env' | ForEach-Object {
    if ($_ -match '^([A-Z_]+)=(.*)$') { $config[$matches[1]] = $matches[2] }
}
$env:API_TOKEN = $config['API_TOKEN']
$env:UI_USER = $config['UI_USER']
$env:UI_PASSWORD = $config['UI_PASSWORD']
$env:API_URL = 'http://127.0.0.1:8000'
$env:DB_PATH = Join-Path $PSScriptRoot 'datos-locales\events.sqlite3'
$localPython = Join-Path $PSScriptRoot '.venv\Scripts\python.exe'
# Reuse the already verified workspace environment when this checkout has it.
$workspacePython = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..\work\venv\Scripts\python.exe'))
if (Test-Path -LiteralPath $workspacePython) {
    $localPython = $workspacePython
} elseif (-not (Test-Path -LiteralPath $localPython)) {
    Write-Host 'Preparando Python para el demo (solo la primera vez)...'
    python -m venv .venv
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo preparar Python. Instala Python 3.12 o 3.13 y vuelve a intentarlo.' }
    & $localPython -m pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) { throw 'No se pudieron descargar las dependencias. Comprueba la conexion.' }
}
& $localPython iniciar_local.py
if ($LASTEXITCODE -ne 0) { throw 'El demo no pudo iniciarse. Revisa el mensaje anterior.' }
