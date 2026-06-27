# Initialize and push Leo Suite public showcase repos (Windows PowerShell).
# Run from: haibao_project/showcase/
#
# Prerequisites:
# 1. Create empty PUBLIC repos on GitHub:
#    - mentorkokkwa/leo-suite-growth-showcase
#    - mentorkokkwa/leo-suite-edutech-showcase
# 2. Make PRIVATE deploy repos:
#    - mentorkokkwa/leo-suite-growth
#    - mentorkokkwa/leo-suite-edutech

param(
    [ValidateSet("growth", "edutech", "both")]
    [string]$Target = "both"
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

function Publish-Showcase {
    param(
        [string]$FolderName,
        [string]$RemoteUrl
    )

    $Path = Join-Path $Root $FolderName
    if (-not (Test-Path $Path)) {
        Write-Error "Folder not found: $Path"
    }

    Write-Host "`n=== Publishing $FolderName ===" -ForegroundColor Cyan
    Set-Location $Path

    if (-not (Test-Path ".git")) {
        git init
        git branch -M main
    }

    git add .
    $Status = git status --porcelain
    if ($Status) {
        git commit -m "Update Leo Suite showcase portfolio"
    } else {
        Write-Host "No changes to commit."
    }

    $Remotes = git remote
    if ($Remotes -notcontains "origin") {
        git remote add origin $RemoteUrl
    }

    git push -u origin main
    Write-Host "Done: $RemoteUrl" -ForegroundColor Green
}

if ($Target -eq "growth" -or $Target -eq "both") {
    Publish-Showcase `
        -FolderName "leo-suite-growth-showcase" `
        -RemoteUrl "https://github.com/mentorkokkwa/leo-suite-growth-showcase.git"
}

if ($Target -eq "edutech" -or $Target -eq "both") {
    Publish-Showcase `
        -FolderName "leo-suite-edutech-showcase" `
        -RemoteUrl "https://github.com/mentorkokkwa/leo-suite-edutech-showcase.git"
}

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Set leo-suite-growth and leo-suite-edutech to PRIVATE on GitHub"
Write-Host "2. Confirm Vercel projects at https://vercel.com/cenzhi"
Write-Host "3. Set EDULENS_AI_MODE=mock on Vercel for demo-safe deployment"
Write-Host "4. Update showcase README.md with Production URLs from Vercel"
