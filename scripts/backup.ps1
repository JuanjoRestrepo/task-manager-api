# Backup script for Windows (PowerShell)

# Cargar .env si existe
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#=]+)=(.+)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"').Trim("'")
            [System.Environment]::SetEnvironmentVariable($name, $value)
        }
    }
}

$DirectUrl = [System.Environment]::GetEnvironmentVariable("DIRECT_URL")

if (-not $DirectUrl) {
    Write-Error "DIRECT_URL no está definida en el archivo .env"
    exit 1
}

$BackupDir = "./backups"
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir
}

$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupName = "backup_$Timestamp.sql"
$BackupPath = "$BackupDir/$BackupName"

Write-Host "Iniciando backup de la base de datos Neon (Windows)..."
& pg_dump $DirectUrl | Out-File -FilePath $BackupPath -Encoding utf8

if ($LASTEXITCODE -eq 0 -or $?) {
    Write-Host "✅ Backup completado con éxito: $BackupPath"
} else {
    Write-Error "❌ Error al realizar el backup"
    exit 1
}
