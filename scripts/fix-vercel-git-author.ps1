# Fix Vercel Hobby team "Git author must have access" block.
# Run AFTER reconnecting GitHub on https://vercel.com/account/settings/authentication
#
# Usage:
#   .\fix-vercel-git-author.ps1 -Email "cenzhi128@gmail.com" -Name "Cenzhi Liu"

param(
    [Parameter(Mandatory = $true)]
    [string]$Email,

    [Parameter(Mandatory = $true)]
    [string]$Name,

    [switch]$Push,
    [switch]$Deploy
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Repos = @(
    @{ Path = "growth";  Project = "leo-suite-growth" },
    @{ Path = "edutech"; Project = "leo-suite-edutech" },
    @{ Path = "robot";   Project = "leo-suite-robot" }
)

Write-Host "`n=== Vercel Git Author Fix ===" -ForegroundColor Cyan
Write-Host "Email: $Email"
Write-Host "Name:  $Name"
Write-Host ""

foreach ($repo in $Repos) {
    $dir = Join-Path $Root $repo.Path
    if (-not (Test-Path $dir)) {
        Write-Warning "Skip missing folder: $dir"
        continue
    }

    Write-Host "--- $($repo.Path) ---" -ForegroundColor Yellow
    Set-Location $dir

    git config user.email $Email
    git config user.name $Name

    $msg = "chore: align git author for Vercel cenzhi Hobby team deploy"
    git commit --allow-empty -m $msg --author="$Name <$Email>"

    if ($Push) {
        git push origin main
        Write-Host "Pushed $($repo.Path)" -ForegroundColor Green
    }

    if ($Deploy) {
        vercel link --yes --scope cenzhi --project $repo.Project
        vercel deploy --prod --yes --scope cenzhi
        Write-Host "Deployed $($repo.Project)" -ForegroundColor Green
    }
}

Write-Host "`nDone. Next:" -ForegroundColor Cyan
Write-Host "1. Reconnect GitHub at https://vercel.com/account/settings/authentication"
if (-not $Push) {
    Write-Host "2. Re-run with -Push to push empty commits: .\fix-vercel-git-author.ps1 -Email ... -Name ... -Push"
}
Write-Host "3. Check Deployments at https://vercel.com/cenzhi"
