# Manual Oracle Cloud Deployment Steps

## Current Status
- ❌ PocketBase not accessible at http://141.148.218.50:8090
- ⚠️ Automatic deployment script incomplete
- 🔧 Need to configure Oracle Cloud Security List manually

## Step 1: Configure Oracle Cloud Firewall

### Add Ingress Rules in Oracle Cloud Console

1. **Log in to Oracle Cloud Console**: https://cloud.oracle.com/
2. Navigate to: **Compute** → **Instances**
3. Click on your VM instance
4. Under **Instance Details**, find **Primary VNIC** section
5. Click on the **Subnet** link (e.g., "subnet-xxxxx")
6. Click on **Security Lists** 
7. Click on **Default Security List**
8. Click **Add Ingress Rules**

### Add These Rules:

**Rule 1: PocketBase**
- Source CIDR: `0.0.0.0/0`
- IP Protocol: `TCP`
- Destination Port Range: `8090`
- Description: `PocketBase Admin UI and API`

**Rule 2: HTTP**
- Source CIDR: `0.0.0.0/0`
- IP Protocol: `TCP`
- Destination Port Range: `80`
- Description: `HTTP`

**Rule 3: HTTPS**
- Source CIDR: `0.0.0.0/0`
- IP Protocol: `TCP`
- Destination Port Range: `443`
- Description: `HTTPS`

9. Click **Add Ingress Rules**

---

## Step 2: Manual SSH Deployment

Open PowerShell and run these commands:

### 1. Connect to VM
```powershell
ssh -i "C:\Users\NIPUN\OneDrive\ssh-key-2025-11-30.key" ubuntu@141.148.218.50
```

### 2. Download PocketBase
```bash
cd ~
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_arm64.zip
sudo apt-get update && sudo apt-get install unzip -y
unzip pocketbase_0.22.0_linux_arm64.zip
chmod +x pocketbase
```

### 3. Test PocketBase
```bash
./pocketbase --version
```

### 4. Create migrations directory
```bash
mkdir -p pb_migrations
```

### 5. Upload migration files from Windows

**Exit SSH** (Ctrl+D) and run on your Windows machine:

```powershell
cd "C:\Users\NIPUN\Downloads\webappzo official confidential\webappzodash\pocketbase"
scp -i "C:\Users\NIPUN\OneDrive\ssh-key-2025-11-30.key" -r pb_migrations/* ubuntu@141.148.218.50:~/pb_migrations/
```

### 6. Reconnect and create systemd service

```powershell
ssh -i "C:\Users\NIPUN\OneDrive\ssh-key-2025-11-30.key" ubuntu@141.148.218.50
```

Then on the server:

```bash
# Create service file
sudo tee /etc/systemd/system/pocketbase.service > /dev/null <<EOF
[Unit]
Description=PocketBase Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu
ExecStart=/home/ubuntu/pocketbase serve --http=0.0.0.0:8090
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable pocketbase
sudo systemctl start pocketbase

# Check status
sudo systemctl status pocketbase
```

### 7. Configure Ubuntu firewall
```bash
sudo ufw allow 8090/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

---

## Step 3: Verify Deployment

### Check if PocketBase is running:
```bash
curl http://localhost:8090/api/health
```

### Check service logs if there are issues:
```bash
sudo journalctl -u pocketbase -f
```

### Access from browser:
Open: http://141.148.218.50:8090/_/

---

## Troubleshooting

### If can't connect from browser:
1. ✅ Check Oracle Cloud Security List has port 8090 ingress rule
2. ✅ Check Ubuntu firewall: `sudo ufw status`
3. ✅ Check service is running: `sudo systemctl status pocketbase`
4. ✅ Check logs: `sudo journalctl -u pocketbase --no-pager -n 50`

### If service won't start:
```bash
# Try running manually to see errors
cd ~
./pocketbase serve --http=0.0.0.0:8090
```

### Restart service:
```bash
sudo systemctl restart pocketbase
```

---

## After Successful Deployment

1. **Open PocketBase Admin**: http://141.148.218.50:8090/_/
2. **Create admin account**
3. **Verify collections exist**: organizations, user_organizations, subscriptions, users
4. **Update frontend env**:
   ```
   NEXT_PUBLIC_POCKETBASE_URL=http://141.148.218.50:8090
   ```
5. **Deploy to Netlify** with this environment variable

---

## Quick Reference

- **SSH**: `ssh -i "C:\Users\NIPUN\OneDrive\ssh-key-2025-11-30.key" ubuntu@141.148.218.50`
- **Admin UI**: http://141.148.218.50:8090/_/
- **API**: http://141.148.218.50:8090
- **Check status**: `sudo systemctl status pocketbase`
- **View logs**: `sudo journalctl -u pocketbase -f`
- **Restart**: `sudo systemctl restart pocketbase`
