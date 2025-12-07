# HMC Website - Ubuntu Server Deployment Guide

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Ubuntu server (20.04 or newer)
- ✅ Root or sudo access
- ✅ Domain name pointing to your server IP
- ✅ GitHub account
- ✅ SSH access to your server

## 🚀 One-Time Server Setup

### Step 1: Connect to Your Server

Open terminal on your local computer and connect to your Ubuntu server:

```bash
ssh username@your-server-ip
```

Replace `username` with your Ubuntu username and `your-server-ip` with your server's IP address.

### Step 2: Install Docker

Run these commands one by one:

```bash
# Update package list
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com | sh

# Add your user to docker group (so you don't need sudo)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt-get install docker-compose-plugin -y

# Verify installation
docker --version
docker-compose --version
```

**IMPORTANT:** Log out and log back in for docker group changes to take effect.

### Step 3: Install Git

```bash
sudo apt install git -y
git --version
```

### Step 4: Clone Your Website Repository

```bash
# Create website directory
sudo mkdir -p /var/www/hmc-website
sudo chown $USER:$USER /var/www/hmc-website

# Navigate to directory
cd /var/www/hmc-website

# Clone repository
git clone https://github.com/hiyamajithiya/HMC-Website.git .
```

### Step 5: Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Edit environment file
nano .env
```

Update these values in the `.env` file:
- Replace `your_resend_api_key_here` with your actual Resend API key from https://resend.com/api-keys
- Update `DATABASE_URL` if using a different database

Press `Ctrl + X`, then `Y`, then `Enter` to save and exit.

### Step 6: Make Scripts Executable

```bash
chmod +x deploy.sh
chmod +x setup-ssl.sh
```

### Step 7: Initial Deployment

```bash
./deploy.sh
```

This will:
- Build Docker images
- Start all containers
- Run health checks
- Show container status

### Step 8: Setup SSL Certificate (HTTPS)

```bash
./setup-ssl.sh
```

Follow the prompts:
1. Enter your domain name (e.g., `himanshumajithiya.com`)
2. Enter your email address
3. Wait for certificate generation

**Note:** Make sure your domain's DNS is pointing to your server IP before running this step.

### Step 9: Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH (if not already allowed)

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## 🔄 Setting Up Auto-Deployment from GitHub

This allows you to update your website by just pushing to GitHub - no server commands needed!

### Step 1: Generate SSH Key on Server

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Press Enter to accept default location
# Press Enter twice to skip password (for automation)

# Display the private key
cat ~/.ssh/id_ed25519
```

Copy the entire private key (including `-----BEGIN` and `-----END` lines).

### Step 2: Add Deploy Key to GitHub

1. Go to your repository: https://github.com/hiyamajithiya/HMC-Website
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Create these three secrets:

   **Secret 1:**
   - Name: `SERVER_SSH_KEY`
   - Value: Paste the private key you copied above

   **Secret 2:**
   - Name: `SERVER_HOST`
   - Value: Your server IP address (e.g., `123.45.67.89`)

   **Secret 3:**
   - Name: `SERVER_USER`
   - Value: Your Ubuntu username (e.g., `ubuntu`)

### Step 3: Add Public Key to Server

```bash
# Display public key
cat ~/.ssh/id_ed25519.pub

# Add it to authorized keys
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
```

### Step 4: Test Auto-Deployment

1. Make any small change to your website (e.g., edit README.md)
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push origin main
   ```
3. Go to your repository → **Actions** tab
4. You should see the deployment running
5. Wait for it to complete (green checkmark)
6. Your website is now updated!

## 📝 Regular Usage - How to Update Your Website

### Option A: Auto-Deployment (Recommended)

Just push your changes to GitHub:

```bash
# On your local computer
git add .
git commit -m "Your update description"
git push origin main
```

GitHub Actions will automatically:
- Deploy to your server
- Rebuild the website
- Restart containers
- Run health checks

### Option B: Manual Deployment

If you prefer manual control:

```bash
# SSH into your server
ssh username@your-server-ip

# Navigate to website directory
cd /var/www/hmc-website

# Run deployment script
./deploy.sh
```

## 🛠️ Useful Commands

### Check Website Status

```bash
cd /var/www/hmc-website
docker-compose ps
```

### View Website Logs

```bash
cd /var/www/hmc-website
docker-compose logs -f
```

Press `Ctrl + C` to stop viewing logs.

### View Specific Service Logs

```bash
# Website logs only
docker-compose logs -f web

# Nginx logs only
docker-compose logs -f nginx
```

### Restart Website

```bash
cd /var/www/hmc-website
docker-compose restart
```

### Stop Website

```bash
cd /var/www/hmc-website
docker-compose down
```

### Start Website

```bash
cd /var/www/hmc-website
docker-compose up -d
```

### Check SSL Certificate Status

```bash
docker-compose exec certbot certbot certificates
```

### Renew SSL Certificate Manually

```bash
docker-compose exec certbot certbot renew
docker-compose restart nginx
```

## 🔍 Troubleshooting

### Website Not Loading

```bash
# Check if containers are running
docker-compose ps

# Check logs for errors
docker-compose logs -f

# Restart everything
docker-compose down
docker-compose up -d
```

### Port Already in Use

```bash
# Find what's using port 80
sudo lsof -i :80

# Kill the process (replace PID with actual process ID)
sudo kill -9 PID

# Or stop the service (e.g., Apache)
sudo systemctl stop apache2
sudo systemctl disable apache2
```

### SSL Certificate Issues

```bash
# Check certificate status
docker-compose exec certbot certbot certificates

# Request new certificate
./setup-ssl.sh
```

### Out of Disk Space

```bash
# Clean up old Docker images
docker image prune -af

# Clean up old containers
docker container prune -f

# Check disk usage
df -h
```

### Permission Denied Errors

```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/hmc-website

# Fix permissions
chmod +x deploy.sh setup-ssl.sh
```

## 📧 Email Setup (Contact Form)

The contact form needs a Resend API key:

1. Go to https://resend.com
2. Create account (free - 3,000 emails/month)
3. Get API key from dashboard
4. Update `.env` file on server:
   ```bash
   nano /var/www/hmc-website/.env
   ```
5. Replace `your_resend_api_key_here` with actual key
6. Save and restart:
   ```bash
   docker-compose restart web
   ```

See [CONTACT_FORM_SETUP.md](CONTACT_FORM_SETUP.md) for detailed instructions.

## 📊 Monitoring

### Check Website is Running

```bash
curl http://localhost:3000
```

Should return HTML content.

### Check HTTPS

```bash
curl https://your-domain.com
```

### Check Docker Resource Usage

```bash
docker stats
```

## 🔐 Security Best Practices

1. **Keep Server Updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Change SSH Port (Optional but Recommended):**
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Change Port 22 to something else like Port 2222
   sudo systemctl restart sshd
   ```

3. **Enable Automatic Security Updates:**
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

4. **Backup Regularly:**
   ```bash
   # Backup script (run weekly)
   cd /var/www
   tar -czf hmc-backup-$(date +%Y%m%d).tar.gz hmc-website
   ```

## 📞 Support

If you need help:
1. Check logs: `docker-compose logs -f`
2. Check troubleshooting section above
3. Contact your developer with:
   - Error message from logs
   - What you were trying to do
   - Screenshot if applicable

## ✅ Checklist - Is Everything Working?

- [ ] Website loads at http://your-domain.com
- [ ] Website loads at https://your-domain.com (SSL)
- [ ] Contact form sends emails
- [ ] Auto-deployment works when pushing to GitHub
- [ ] All containers running: `docker-compose ps`
- [ ] No errors in logs: `docker-compose logs`

---

**Your website is now deployed! 🎉**

Access it at: https://your-domain.com
