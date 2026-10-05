<#
.SYNOPSIS
  GitHub Pages deployment helper for a static project
.DESCRIPTION
  Initializes the repo, prepares GitHub Pages deployment, and pushes the project
  to a GitHub branch suitable for Pages hosting.
.AUTHOR
  Kateta Technologies (Assochemm)
.VERSION
  1.1
.LICENSE
  MIT
#>

param(
    [string]$RepoURL,
    [string]$BranchName = "gh-pages"
)

# ============================
#  🔹 Banner & Layout
# ============================

$blue   = "Blue"
$green  = "Green"
$yellow = "Yellow"
$red    = "Red"

Write-Host ""
Write-Host "===============================================" -ForegroundColor $blue
Write-Host "      🔹 GitHub Pages Deployment 🔹" -ForegroundColor $blue
Write-Host "===============================================" -ForegroundColor $blue
Write-Host ""

# ============================
#  🔹 Step 1: Check Git
# ============================

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor $red
    exit 1
}

# ============================
#  🔹 Step 2: Move to project folder
# ============================

Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Definition)
$ProjectDir = 'C:\Users\Admin\Documents\KATETA_PROJECTS\WEB\KATETA-TECH\portfoilo-test'
Write-Host "📂 Project Directory: $ProjectDir" -ForegroundColor $green

# ============================
#  🔹 Step 3: Get repo URL and branch
# ============================

if (-not $RepoURL) {
    $RepoURL = Read-Host "🌐 Enter your GitHub repo URL"
}

if (-not $RepoURL) {
    Write-Host "❌ A GitHub repository URL is required." -ForegroundColor $red
    exit 1
}

if (-not $BranchName) {
    $BranchName = Read-Host "🌿 Enter branch to deploy (default: gh-pages)"
    if (-not $BranchName) { $BranchName = "gh-pages" }
}

Write-Host "🌿 Deploy branch: $BranchName" -ForegroundColor $green

# ============================
#  🔹 Step 4: Initialize Git repo if needed
# ============================

if (-not (Test-Path ".git")) {
    Write-Host "🔧 Initializing new git repository..." -ForegroundColor $yellow
    git init | Out-Null
    git branch -M $BranchName
    git remote add origin $RepoURL
} else {
    Write-Host "🔎 Git repository detected. Updating remote origin..." -ForegroundColor $yellow
    git remote set-url origin $RepoURL
}

# ============================
#  🔹 Step 5: Ensure branch is ready for GitHub Pages
# ============================

try {
    git checkout $BranchName *> $null
} catch {
    git checkout -b $BranchName *> $null
}

# ============================
#  🔹 Step 6: Create .gitignore if missing
# ============================

if (-not (Test-Path ".gitignore")) {
    Write-Host "📝 Creating a default .gitignore..." -ForegroundColor $yellow
    @"
# OS / Editor
.DS_Store
Thumbs.db
.vscode/
.idea/
*.swp

# Python
__pycache__/
*.pyc
.env

# Node / Web
node_modules/
dist/
build/

# Logs
*.log

# Misc
*.bak
*.tmp
"@ | Out-File -Encoding UTF8 .gitignore
}

# ============================
#  🔹 Step 7: Commit & push
# ============================

Write-Host "📦 Staging all changes..." -ForegroundColor $green
git add .

$CommitMsg = "Deploy to GitHub Pages: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $CommitMsg 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ℹ️ No changes to commit yet." -ForegroundColor $yellow
}

Write-Host "⬆️ Pushing to GitHub Pages branch: $BranchName" -ForegroundColor $green
git push -u origin $BranchName --force

# ============================
#  🔹 Done
# ============================

Write-Host ""
Write-Host "===============================================" -ForegroundColor $blue
Write-Host "✅ GitHub Pages deployment is ready!" -ForegroundColor $green
Write-Host "🌐 Repository: $RepoURL" -ForegroundColor $green
Write-Host "🌿 Branch:     $BranchName" -ForegroundColor $green
Write-Host "===============================================" -ForegroundColor $blue
Write-Host ""
