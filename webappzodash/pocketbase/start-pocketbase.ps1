# Start PocketBase Server
# This script starts the PocketBase server with appropriate settings

Write-Host "Starting PocketBase server..." -ForegroundColor Green
Write-Host "Admin UI will be available at: http://localhost:8090/_/" -ForegroundColor Yellow
Write-Host "API will be available at: http://localhost:8090/api/" -ForegroundColor Yellow
Write-Host "`nPress Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host "----------------------------------------`n" -ForegroundColor Gray

# Start PocketBase
.\pocketbase.exe serve --http=127.0.0.1:8090
