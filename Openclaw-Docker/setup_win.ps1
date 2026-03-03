$ErrorActionPreference = "Stop"

# 1. Check Docker
Write-Host "==> Checking Docker connectivity..."
try {
    docker info > $null
    Write-Host "Docker is running." -ForegroundColor Green
} catch {
    Write-Error "Docker is NOT running or accessible.`nPlease start Docker Desktop and try again."
}

# 2. Set Directories
$ScriptDir = "C:\Users\user\Openclaw\Openclaw-Docker"
Set-Location $ScriptDir
$ConfigDir = "C:\Users\user\.openclaw"
$WorkspaceDir = "C:\Users\user\Openclaw\SafeWorkspace"

New-Item -ItemType Directory -Force -Path $ConfigDir | Out-Null
New-Item -ItemType Directory -Force -Path $WorkspaceDir | Out-Null

# 3. Generate Env File
$EnvFile = "$ScriptDir\.env"
if (-not (Test-Path $EnvFile)) {
    Write-Host "==> Generating .env file..."
    $Token = [Guid]::NewGuid().ToString("N")
    
    $Content = @"
OPENCLAW_CONFIG_DIR=$ConfigDir
OPENCLAW_WORKSPACE_DIR=$WorkspaceDir
OPENCLAW_GATEWAY_PORT=18789
OPENCLAW_BRIDGE_PORT=18790
OPENCLAW_GATEWAY_BIND=lan
OPENCLAW_GATEWAY_TOKEN=$Token
OPENCLAW_IMAGE=openclaw:local
"@
    Set-Content -Path $EnvFile -Value $Content
}

# 4. Build
Write-Host "==> Building Docker images (Gateway & Browser)..."
docker compose build
if ($LASTEXITCODE -ne 0) { Write-Error "Build failed" }

# 5. Onboard
$configPath = "$env:USERPROFILE\.openclaw\openclaw.json"
if (Test-Path $configPath) {
    Write-Host "Configuration found at $configPath. Skipping onboarding."
    Write-Host "To re-configure, delete or rename this file and run setup again."
} else {
    Write-Host "==> Starting onboarding..."
    # Interactive onboarding
    # winpty is recommended for interactive Docker TUI on Windows
    if (Get-Command winpty -ErrorAction SilentlyContinue) {
        winpty docker compose run --rm -it openclaw-cli onboard --no-install-daemon
    } else {
        # Fallback if winpty is missing (interaction might be limited)
        docker compose run --rm -it openclaw-cli onboard --no-install-daemon
    }
}

Write-Host "==> Starting Gateway..."
docker compose up -d openclaw-gateway

Write-Host "`nSetup Complete!" -ForegroundColor Green
Write-Host "To use OpenClaw TUI, run: docker compose run --rm openclaw-cli tui"
Write-Host "Or use the web interface at http://localhost:18789"
