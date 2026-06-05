# Git config + push
$GH_TOKEN = "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"
$GH_USER  = "ricochet87"
$REPO     = "equipos-viales"
$PATH_    = "C:\Users\Noxi-PC\Desktop\BD\04_Proyectos\01_Equipos_Viales"
$LOG      = "$PATH_\setup-log.txt"

function Log($m) { Write-Host $m; Add-Content $LOG "`n[GIT] $m" }

git config --global user.email "rosellomatias87@gmail.com"
git config --global user.name "ricochet87"
Log "Git user config: OK"

Set-Location $PATH_

if (-not (Test-Path ".git")) { git init; git branch -M main }

git add . 2>&1 | Out-Null
$c = git commit -m "Inicial: Equipos Viales DVP Chaco" 2>&1
Log "commit: $c"

$remote = "https://${GH_USER}:${GH_TOKEN}@github.com/$GH_USER/$REPO.git"
git remote remove origin 2>&1 | Out-Null
git remote add origin $remote 2>&1 | Out-Null

$push = git push -u origin main 2>&1
Log "push result: $push"

if ($LASTEXITCODE -eq 0) {
    Log "OK - Codigo subido: https://github.com/$GH_USER/$REPO"
    git remote set-url origin "https://github.com/$GH_USER/$REPO.git"
} else {
    Log "ERROR en push"
}

Remove-Item $MyInvocation.MyCommand.Path -Force -ErrorAction SilentlyContinue
