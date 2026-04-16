# AWS Deployment Guide - Mini CRM

Complete guide to deploy Mini CRM backend and frontend on AWS EC2.

## 📋 Prerequisites

1. **AWS Account** (create at https://aws.amazon.com)
2. **Free Tier Eligible** - EC2 t2.micro is free for 12 months
3. **SSH Client** - Built-in on Windows/Mac/Linux

---

## 🚀 Step 1: Create AWS Account

1. Go to https://aws.amazon.com
2. Click **"Create AWS Account"**
3. Enter email and password
4. Verify email
5. Add payment method (won't charge for free tier)
6. Choose **Free Tier** plan

---

## 🖥️ Step 2: Launch EC2 Instance

### 2.1: Go to EC2 Dashboard
1. Log in to AWS Console
2. Search for **"EC2"**
3. Click **"Instances"**
4. Click **"Launch Instances"**

### 2.2: Configure Instance

**Name & OS:**
- Name: `mini-crm-server`
- OS: **Ubuntu** (20.04 or later)
- Architecture: **64-bit (x86)**

**Instance Type:**
- Select: **t2.micro** (Free tier eligible)

**Key Pair (Important!):**
1. Click **"Create new key pair"**
2. Name: `mini-crm-key`
3. Type: **RSA**
4. Format: **.pem** (for Linux/Mac) or **.ppk** (for Windows with PuTTY)
5. **Download and save** the key file safely!

**Network:**
- VPC: Default VPC
- Auto-assign public IP: **Enable**

**Security Group:**
1. Create new security group: `mini-crm-sg`
2. Add these rules:
   - **SSH (Port 22):** Source = Your IP / 0.0.0.0/0
   - **HTTP (Port 80):** Source = 0.0.0.0/0
   - **HTTPS (Port 443):** Source = 0.0.0.0/0
   - **Custom (Port 8000):** Source = 0.0.0.0/0 (FastAPI)

**Storage:**
- Volume size: **30 GB** (Free tier allows up to 30GB)

### 2.3: Launch
- Click **"Launch Instance"**
- Wait 2-3 minutes for instance to start
- Note the **Public IP Address** (e.g., `54.123.45.67`)

---

## 💻 Step 3: Connect to EC2 Instance

### For Windows (PowerShell):
```powershell
# Navigate to your key file location
cd "C:\path\to\mini-crm-key.pem"

# Connect to instance
ssh -i "mini-crm-key.pem" ubuntu@YOUR_PUBLIC_IP
# Replace YOUR_PUBLIC_IP with your instance IP
```

### For Mac/Linux:
```bash
chmod 400 mini-crm-key.pem
ssh -i "mini-crm-key.pem" ubuntu@YOUR_PUBLIC_IP
```

---

## 📦 Step 4: Install Dependencies

Once connected to EC2, run these commands:

### Update System
```bash
sudo apt update
sudo apt upgrade -y
```

### Install Python & pip
```bash
sudo apt install -y python3 python3-pip python3-venv
```

### Install Node.js & npm
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs npm
```

### Install Git
```bash
sudo apt install -y git
```

### Install PostgreSQL Client
```bash
sudo apt install -y postgresql-client
```

### Install Nginx (Reverse Proxy)
```bash
sudo apt install -y nginx
```

---

## 🚀 Step 5: Deploy Backend

### 5.1: Clone Repository
```bash
cd /home/ubuntu
git clone https://github.com/afthah-commits/mini_crm.git
cd mini_crm/backend
```

### 5.2: Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 5.3: Install Dependencies
```bash
pip install -r requirements.txt
```

### 5.4: Create .env File
```bash
nano .env
```

Paste this and update with your Railway database URL:
```
APP_NAME=Lead Management API
API_PREFIX=/api/v1
SECRET_KEY=<generate-random-secret-key>
DATABASE_URL=postgresql://postgres:95264637afthah@dbhost.railway.internal:5432/lead_management
BACKEND_CORS_ORIGINS=http://localhost,http://YOUR_INSTANCE_IP
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### 5.5: Test Backend Locally
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open in browser: `http://YOUR_INSTANCE_IP:8000`

Stop with `Ctrl+C`

---

## 🎨 Step 6: Deploy Frontend

### 6.1: Update Frontend Config
```bash
cd /home/ubuntu/mini_crm/frontend
cat > .env << EOF
VITE_API_BASE_URL=http://YOUR_INSTANCE_IP/api/v1
EOF
```

### 6.2: Build Frontend
```bash
npm install
npm run build
```

This creates a `dist` folder with static files.

---

## 🔧 Step 7: Configure Nginx (Web Server)

### 7.1: Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/mini-crm
```

Paste this config:
```nginx
server {
    listen 80;
    server_name YOUR_INSTANCE_IP;

    # Frontend (React static files)
    location / {
        alias /home/ubuntu/mini_crm/frontend/dist/;
        try_files $uri /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Save: `Ctrl+X`, `Y`, `Enter`

### 7.2: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/mini-crm /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
```

### 7.3: Test Nginx Config
```bash
sudo nginx -t
```

Should see: `nginx: configuration is OK`

### 7.4: Start Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 🚀 Step 8: Run Backend with PM2 (Process Manager)

### 8.1: Install PM2
```bash
sudo npm install -g pm2
```

### 8.2: Create PM2 Config
```bash
cd /home/ubuntu/mini_crm/backend
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'mini-crm-api',
    script: '/home/ubuntu/mini_crm/backend/venv/bin/uvicorn',
    args: 'app.main:app --host 0.0.0.0 --port 8000',
    env: {
      PATH: '/home/ubuntu/mini_crm/backend/venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
    }
  }]
}
EOF
```

### 8.3: Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

---

## ✅ Step 9: Verify Everything Works

### Test API
```bash
curl http://YOUR_INSTANCE_IP/api/v1/
```

Should return: `{"message":"Lead Management API is running"}`

### Test Frontend
Open in browser: `http://YOUR_INSTANCE_IP`

Should see your CRM login page!

---

## 📝 Updating Code Later

When you make changes and push to GitHub:

```bash
cd /home/ubuntu/mini_crm
git pull origin main

# Update backend
cd backend
pip install -r requirements.txt
pm2 restart mini-crm-api

# Update frontend
cd ../frontend
npm install
npm run build

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🆘 Troubleshooting

### Backend not starting?
```bash
pm2 logs mini-crm-api
```

### Nginx not seeing frontend?
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Can't connect to database?
- Check Railway database URL is correct
- Ensure it's in `.env` file
- Check PostgreSQL client is installed

### Port 8000 already in use?
```bash
sudo lsof -i :8000
sudo kill -9 <PID>
```

---

## 💰 Cost Estimate

**For first 12 months (Free Tier):**
- EC2 t2.micro: **FREE** (720 hours/month)
- Data transfer: **FREE** (15GB/month)

**After 12 months:**
- EC2 t2.micro: ~$8-10/month
- Minimal data transfer

---

## 🎉 Your App is Live!

Access at: `http://YOUR_INSTANCE_IP`

Share this URL with anyone!

---

## 📌 Quick Commands Reference

```bash
# SSH into server
ssh -i "mini-crm-key.pem" ubuntu@YOUR_PUBLIC_IP

# Check backend status
pm2 status
pm2 logs mini-crm-api

# Check Nginx
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart mini-crm-api
sudo systemctl reload nginx
```

---

Good luck! 🚀
