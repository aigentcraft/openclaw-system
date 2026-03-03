$ScriptDir = "C:\Users\user\Openclaw\Openclaw-Docker"
Set-Location $ScriptDir

Write-Host "Starting OpenClaw in Docker..."
docker compose up -d openclaw-gateway
docker compose ps

$envPath = "$ScriptDir\.env"
$envContent = Get-Content $envPath
foreach ($line in $envContent) {
    if ($line -match "OPENCLAW_GATEWAY_TOKEN=(.*)") {
        $env:OPENCLAW_GATEWAY_TOKEN = $matches[1]
        break
    }
}

Write-Host "`nOpenClaw Gateway is running."
Write-Host "Starting TUI..."
winpty docker compose run --rm -it openclaw-cli tui --url ws://openclaw-gateway:18789 --token $env:OPENCLAW_GATEWAY_TOKEN
