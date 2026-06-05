# ============================================================
# EQUIPOS VIALES - Script de configuracion GitHub
# Doble click -> "Ejecutar con PowerShell"
# ============================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EQUIPOS VIALES - Setup GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Git no esta instalado." -ForegroundColor Red
    Write-Host "Instala git desde https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit
}

Write-Host "Git encontrado: $(git --version)" -ForegroundColor Green
Write-Host ""

# Pedir usuario de GitHub
$githubUser = Read-Host "Ingresa tu usuario de GitHub (ej: ricochet87)"
$repoName   = Read-Host "Nombre del repositorio (Enter = equipos-viales)"
if ([string]::IsNullOrWhiteSpace($repoName)) { $repoName = "equipos-viales" }

Write-Host ""
Write-Host "Configurando repositorio..." -ForegroundColor Yellow

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

# Inicializar git si no existe
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
    Write-Host "Repositorio git inicializado." -ForegroundColor Green
} else {
    Write-Host "Repositorio git ya existe." -ForegroundColor Green
}

# Agregar archivos
git add .
git commit -m "Inicial: Equipos Viales DVP Chaco" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Ya hay un commit inicial, continuando..." -ForegroundColor Yellow
}

# Configurar remote
$remoteUrl = "https://github.com/$githubUser/$repoName.git"
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    git remote set-url origin $remoteUrl
} else {
    git remote add origin $remoteUrl
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  PASO MANUAL REQUERIDO" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abre github.com/new en tu navegador" -ForegroundColor White
Write-Host "2. Crea un repo llamado: $repoName" -ForegroundColor Cyan
Write-Host "   - Dejalo en PRIVADO" -ForegroundColor White
Write-Host "   - NO inicialices con README" -ForegroundColor White
Write-Host "3. Vuelve aqui y presiona Enter" -ForegroundColor White
Write-Host ""
Read-Host "Presiona Enter cuando el repo este creado en GitHub"

Write-Host ""
Write-Host "Subiendo codigo..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  EXITO! Codigo subido a GitHub" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repo: https://github.com/$githubUser/$repoName" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Proximo paso: conectar con Vercel" -ForegroundColor Yellow
    Write-Host "Ve a vercel.com -> New Project -> importa este repo" -ForegroundColor White
    Write-Host ""
    Write-Host "Variables de entorno que necesitas en Vercel:" -ForegroundColor Yellow
    Write-Host "  NEXT_PUBLIC_SUPABASE_URL = (tu URL de Supabase)" -ForegroundColor White
    Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY = (tu anon key)" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Error al hacer push. Puede ser autenticacion." -ForegroundColor Red
    Write-Host "Asegurate de haber iniciado sesion en GitHub en tu navegador" -ForegroundColor Yellow
    Write-Host "o configura un token personal en: github.com/settings/tokens" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Presiona Enter para cerrar"
