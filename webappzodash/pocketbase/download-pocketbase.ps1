# PocketBase Download and Setup Script
# This script downloads and extracts PocketBase for Windows

Write-Host "Downloading PocketBase v0.22.0 for Windows..." -ForegroundColor Green

# Download URL
$downloadUrl = "https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_windows_amd64.zip"
$zipFile = "pocketbase.zip"

try {
    # Download PocketBase
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -UseBasicParsing
    Write-Host "Download complete!" -ForegroundColor Green

    # Extract the zip file
    Write-Host "Extracting PocketBase..." -ForegroundColor Green
    Expand-Archive -Path $zipFile -DestinationPath "." -Force

    # Clean up zip file
    Remove-Item $zipFile
    Write-Host "Cleanup complete!" -ForegroundColor Green

    Write-Host "`nPocketBase has been successfully installed!" -ForegroundColor Green
    Write-Host "To start PocketBase, run: .\start-pocketbase.ps1" -ForegroundColor Yellow
    Write-Host "Or manually run: .\pocketbase.exe serve" -ForegroundColor Yellow
}
catch {
    Write-Host "Error downloading PocketBase: $_" -ForegroundColor Red
    Write-Host "`nPlease download manually from: https://pocketbase.io/docs/" -ForegroundColor Yellow
}
