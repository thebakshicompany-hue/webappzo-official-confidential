# Oracle Cloud Deployment Script for PocketBase

Write-Host "=== PocketBase Oracle Cloud Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify Prerequisites
Write-Host "Step 1: Verifying prerequisites..." -ForegroundColor Yellow
$sshKeyPath = Read-Host "Enter the full path to your SSH private key (e.g., C:\Users\NIPUN\OneDrive\ssh-key-2025-11-30.key)"
$oracleIP = Read-Host "Enter your Oracle Cloud VM public IP address"
$sshUser = Read-Host "Enter SSH username (usually 'ubuntu' for Ubuntu instances)"

Write-Host "`nConnecting to $oracleIP as $sshUser..." -ForegroundColor Green

# Step 2: Test SSH Connection
Write-Host "`nStep 2: Testing SSH connection..." -ForegroundColor Yellow
Write-Host "Attempting to connect (you may need to type 'yes' to accept the host key)..."
ssh -i "$sshKeyPath" "$sshUser@$oracleIP" "echo 'SSH connection successful!'"

if ($LASTEXITCODE -ne 0) {
    Write-Host "SSH connection failed. Please check:" -ForegroundColor Red
    Write-Host "  1. SSH key path is correct" -ForegroundColor Red
    Write-Host "  2. IP address is correct" -ForegroundColor Red
    Write-Host "  3. Security group allows SSH (port 22)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`nSSH connection working!" -ForegroundColor Green

# Step 3: Download PocketBase for Linux
Write-Host "`nStep 3: Downloading PocketBase for Linux ARM64..." -ForegroundColor Yellow
$pbVersion = "0.22.0"
$pbUrl = "https://github.com/pocketbase/pocketbase/releases/download/v$pbVersion/pocketbase_${pbVersion}_linux_arm64.zip"
$pbZip = "pocketbase_linux.zip"

Write-Host "Downloading from $pbUrl..."
Invoke-WebRequest -Uri $pbUrl -OutFile $pbZip -UseBasicParsing

Write-Host "Download complete!" -ForegroundColor Green

# Step 4: Create deployment package
Write-Host "`nStep 4: Creating deployment package..." -ForegroundColor Yellow
$deployDir = "pocketbase_deploy"

if (Test-Path $deployDir) {
    Remove-Item -Path $deployDir -Recurse -Force
}

New-Item -Path $deployDir -ItemType Directory | Out-Null
Expand-Archive -Path $pbZip -DestinationPath $deployDir -Force
Copy-Item -Path "pb_migrations" -Destination "$deployDir/pb_migrations" -Recurse -ErrorAction SilentlyContinue

Write-Host "Deployment package created!" -ForegroundColor Green

# Step 5: Upload to Oracle Cloud
Write-Host "`nStep 5: Uploading to Oracle Cloud VM..." -ForegroundColor Yellow
Write-Host "This may take a minute..."
scp -i "$sshKeyPath" -r "$deployDir/*" "${sshUser}@${oracleIP}:~/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Upload failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Upload complete!" -ForegroundColor Green

# Step 6: Remote setup - Make executable
Write-Host "`nStep 6: Setting up PocketBase on remote server..." -ForegroundColor Yellow
ssh -i "$sshKeyPath" "$sshUser@$oracleIP" "cd ~ && chmod +x pocketbase && ./pocketbase --version"

# Step 7: Create systemd service
Write-Host "`nStep 7: Creating systemd service..." -ForegroundColor Yellow

$serviceFile = "/tmp/pocketbase.service"
$serviceContent = @"
[Unit]
Description=PocketBase Service
After=network.target

[Service]
Type=simple
User=$sshUser
WorkingDirectory=/home/$sshUser
ExecStart=/home/$sshUser/pocketbase serve --http=0.0.0.0:8090
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
"@

# Write service file content to temp file on remote server
$serviceContent | ssh -i "$sshKeyPath" "$sshUser@$oracleIP" "cat > $serviceFile"

# Install and start service
ssh -i "$sshKeyPath" "$sshUser@$oracleIP" @"
sudo mv $serviceFile /etc/systemd/system/pocketbase.service && \
sudo systemctl daemon-reload && \
sudo systemctl enable pocketbase && \
sudo systemctl start pocketbase && \
sleep 2 && \
sudo systemctl status pocketbase --no-pager
"@

Write-Host "`nPocketBase service installed and started!" -ForegroundColor Green

# Step 8: Open Ubuntu firewall
Write-Host "`nStep 8: Configuring Ubuntu firewall..." -ForegroundColor Yellow
ssh -i "$sshKeyPath" "$sshUser@$oracleIP" @"
sudo ufw allow 8090/tcp && \
sudo ufw allow 80/tcp && \
sudo ufw allow 443/tcp && \
sudo ufw status
"@

# Step 9: Verify deployment
Write-Host "`nStep 9: Verifying deployment..." -ForegroundColor Yellow
Write-Host "Waiting for PocketBase to start..."
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://${oracleIP}:8090/api/health" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "`nPocketBase is live!" -ForegroundColor Green
    Write-Host "Admin UI: http://${oracleIP}:8090/_/" -ForegroundColor Cyan
    Write-Host "API URL: http://${oracleIP}:8090" -ForegroundColor Cyan
} catch {
    Write-Host "`nCouldn't connect to PocketBase API. This might mean:" -ForegroundColor Yellow
    Write-Host "  - Oracle Cloud Security List needs port 8090 opened (check OCI console)" -ForegroundColor Yellow
    Write-Host "  - Service is still starting up (wait 30 seconds and try again)" -ForegroundColor Yellow
    Write-Host "`nManually check: http://${oracleIP}:8090/_/" -ForegroundColor Cyan
}

# Cleanup
Write-Host "`nCleaning up local files..." -ForegroundColor Yellow
Remove-Item -Path $pbZip -Force -ErrorAction SilentlyContinue
Remove-Item -Path $deployDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n=== Deployment Complete! ===" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Open http://${oracleIP}:8090/_/ in your browser"
Write-Host "2. Create an admin account"
Write-Host "3. Verify collections were created by migrations"
Write-Host "4. Update your frontend .env.local with:"
Write-Host "   NEXT_PUBLIC_POCKETBASE_URL=http://${oracleIP}:8090" -ForegroundColor Yellow
Write-Host "5. Deploy frontend to Netlify with this env var"
Write-Host "`nTo check PocketBase status on the server:"
Write-Host "ssh -i `"$sshKeyPath`" $sshUser@$oracleIP 'sudo systemctl status pocketbase'" -ForegroundColor Gray

Write-Host "`nPress Enter to close..."
Read-Host
