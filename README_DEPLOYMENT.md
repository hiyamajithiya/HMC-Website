# HMC Website - Production Deployment

## 📁 Deployment Files Overview

This folder contains all files needed to deploy the HMC website to an Ubuntu server using Docker.

### 🗂️ File Structure

```
himanshumajithiya-website/
├── Dockerfile                    # Docker image configuration
├── docker-compose.yml            # Multi-container orchestration
├── next.config.js               # Next.js production config
├── .dockerignore                # Files to exclude from Docker build
├── .env.example                 # Environment variables template
├── deploy.sh                    # One-click deployment script
├── setup-ssl.sh                 # SSL certificate setup script
├── monitor.sh                   # Health monitoring script
├── nginx/                       # Nginx reverse proxy config
│   ├── nginx.conf              # Main nginx configuration
│   └── conf.d/
│       └── default.conf        # Site-specific config
├── .github/workflows/
│   └── deploy.yml              # Auto-deployment from GitHub
├── DEPLOYMENT_GUIDE.md         # Complete deployment instructions
├── QUICK_START.md              # Non-coder friendly guide
└── CONTACT_FORM_SETUP.md       # Email integration guide
```

## 🚀 Quick Deployment (3 Steps)

### For Non-Technical Users

1. **Setup Server (One-time):**
   ```bash
   # Follow DEPLOYMENT_GUIDE.md sections 1-6
   ```

2. **Deploy Website:**
   ```bash
   cd /var/www/hmc-website
   ./deploy.sh
   ```

3. **Setup HTTPS:**
   ```bash
   ./setup-ssl.sh
   ```

**Done!** Your website is live at https://your-domain.com

## 🏗️ What Each File Does

### Core Deployment Files

#### `Dockerfile`
- **Purpose:** Defines how to build the website Docker image
- **What it does:**
  - Uses Node.js 20 Alpine (lightweight Linux)
  - Installs dependencies
  - Builds Next.js production bundle
  - Creates optimized production image
- **When modified:** When changing Node version or build process
- **Tech level:** Advanced

#### `docker-compose.yml`
- **Purpose:** Orchestrates all services (website, nginx, SSL)
- **What it does:**
  - Runs Next.js website on port 3000
  - Runs Nginx reverse proxy on ports 80/443
  - Manages SSL certificate renewal
  - Connects all services together
- **When modified:** When adding new services or changing ports
- **Tech level:** Intermediate

#### `next.config.js`
- **Purpose:** Next.js production configuration
- **What it does:**
  - Enables standalone output for Docker
  - Configures image optimization
  - Sets security headers
- **When modified:** When changing Next.js behavior
- **Tech level:** Intermediate

### Deployment Scripts

#### `deploy.sh` ⭐ Most Important
- **Purpose:** One-click deployment script
- **What it does:**
  1. Pulls latest code from GitHub
  2. Stops old containers
  3. Builds new Docker images
  4. Starts new containers
  5. Runs health checks
  6. Cleans up old images
- **Usage:**
  ```bash
  ./deploy.sh
  ```
- **When to run:** After every code change, or use auto-deploy
- **Tech level:** Beginner-friendly

#### `setup-ssl.sh`
- **Purpose:** Automatic HTTPS setup with Let's Encrypt
- **What it does:**
  1. Requests SSL certificate from Let's Encrypt
  2. Configures Nginx for HTTPS
  3. Sets up auto-renewal
- **Usage:**
  ```bash
  ./setup-ssl.sh
  ```
- **When to run:** Once during initial setup
- **Tech level:** Beginner-friendly

#### `monitor.sh`
- **Purpose:** Health check script
- **What it does:**
  - Checks if Docker is running
  - Verifies containers are up
  - Tests website response
  - Checks SSL certificate
  - Monitors disk and memory
  - Scans for errors in logs
- **Usage:**
  ```bash
  ./monitor.sh
  ```
- **When to run:** Weekly or when troubleshooting
- **Tech level:** Beginner-friendly

### Nginx Configuration

#### `nginx/nginx.conf`
- **Purpose:** Main Nginx web server configuration
- **What it does:**
  - Sets up worker processes
  - Configures logging
  - Enables gzip compression
  - Sets security defaults
- **When modified:** Rarely, only for global changes
- **Tech level:** Advanced

#### `nginx/conf.d/default.conf`
- **Purpose:** Website-specific Nginx configuration
- **What it does:**
  - HTTP → HTTPS redirect
  - SSL certificate configuration
  - Reverse proxy to Next.js
  - Security headers
  - Static file caching
- **When modified:** To change domain name or caching rules
- **Tech level:** Intermediate

### GitHub Actions

#### `.github/workflows/deploy.yml`
- **Purpose:** Automatic deployment when you push to GitHub
- **What it does:**
  1. Triggered when you push to `main` branch
  2. Connects to your server via SSH
  3. Pulls latest code
  4. Runs deployment
  5. Checks if website is healthy
  6. Sends notification
- **Setup:** Requires GitHub Secrets (explained in DEPLOYMENT_GUIDE.md)
- **When modified:** Rarely, unless changing deployment logic
- **Tech level:** Intermediate

### Documentation

#### `DEPLOYMENT_GUIDE.md` 📖
- **For:** Technical users and initial setup
- **Contains:**
  - Complete step-by-step server setup
  - Docker installation
  - GitHub Actions configuration
  - Troubleshooting guide
  - Security best practices

#### `QUICK_START.md` 📖
- **For:** Non-technical users (you!)
- **Contains:**
  - How to update website content
  - Email setup instructions
  - Common tasks in simple language
  - Emergency commands
  - Weekly health checklist

#### `CONTACT_FORM_SETUP.md` 📧
- **For:** Setting up contact form emails
- **Contains:**
  - Resend account creation
  - API key configuration
  - Domain verification
  - Troubleshooting email issues

## 🔄 Deployment Workflows

### Workflow 1: Auto-Deployment (Recommended)

```
You edit code → Commit → Push to GitHub
    ↓
GitHub Actions triggers
    ↓
Automatically deploys to server
    ↓
Website updates (2-3 minutes)
```

**Best for:** Regular content updates, small changes

### Workflow 2: Manual Deployment

```
SSH into server → cd /var/www/hmc-website
    ↓
git pull origin main
    ↓
./deploy.sh
    ↓
Website updates (1-2 minutes)
```

**Best for:** When you want manual control, testing

### Workflow 3: Local Testing → Deploy

```
Edit locally → Test on localhost
    ↓
Commit and push to GitHub
    ↓
Auto-deploys to server
```

**Best for:** Major changes, new features

## 🛡️ Security Features

All deployment files include:

- ✅ **SSL/HTTPS encryption** - Automatic Let's Encrypt certificates
- ✅ **Security headers** - XSS protection, frame options, etc.
- ✅ **Firewall rules** - Only necessary ports open
- ✅ **Non-root containers** - Runs as limited user
- ✅ **Environment isolation** - Secrets in .env file
- ✅ **Automatic updates** - Container restarts on failure
- ✅ **Rate limiting** - Nginx connection limits
- ✅ **Health checks** - Automatic container health monitoring

## 📊 Monitoring & Logs

### View All Logs
```bash
docker-compose logs -f
```

### View Website Logs Only
```bash
docker-compose logs -f web
```

### View Nginx Logs Only
```bash
docker-compose logs -f nginx
```

### Run Health Check
```bash
./monitor.sh
```

### Check Container Status
```bash
docker-compose ps
```

## 🔧 Common Modifications

### Change Domain Name

1. Edit `nginx/conf.d/default.conf`
2. Replace `himanshumajithiya.com` with your domain
3. Run `./setup-ssl.sh`

### Change Ports

1. Edit `docker-compose.yml`
2. Change port mappings (e.g., `"3000:3000"` → `"8080:3000"`)
3. Run `docker-compose up -d`

### Add Environment Variables

1. Edit `.env` file
2. Add your variables
3. Run `docker-compose restart web`

### Update Node Version

1. Edit `Dockerfile`
2. Change `FROM node:20-alpine` to desired version
3. Run `./deploy.sh`

## 🆘 Troubleshooting

### Website Not Loading

```bash
# Check if containers are running
docker-compose ps

# Restart everything
docker-compose restart

# Check logs for errors
docker-compose logs -f
```

### SSL Certificate Issues

```bash
# Check certificate
docker-compose exec certbot certbot certificates

# Renew certificate
./setup-ssl.sh
```

### Out of Memory

```bash
# Clean up old images
docker image prune -af

# Check memory usage
free -h

# Restart Docker
sudo systemctl restart docker
```

### Port Already in Use

```bash
# Find what's using port 80
sudo lsof -i :80

# Stop the service (e.g., Apache)
sudo systemctl stop apache2
```

## 📈 Performance Optimization

The deployment includes:

- ✅ **Multi-stage Docker builds** - Smaller image size
- ✅ **Gzip compression** - Faster page loads
- ✅ **Static file caching** - Browser caching for images/CSS/JS
- ✅ **Health checks** - Automatic container restart on failure
- ✅ **Resource limits** - Prevents container from using too much memory
- ✅ **Image optimization** - Next.js automatic image optimization

## 🔄 Update Process

### Update Website Content
1. Edit files locally or on GitHub
2. Commit changes
3. Push to GitHub
4. Auto-deploys automatically!

### Update Deployment Files
1. Edit deployment file (e.g., `docker-compose.yml`)
2. Commit and push
3. SSH to server:
   ```bash
   cd /var/www/hmc-website
   git pull origin main
   ./deploy.sh
   ```

### Update Dependencies
1. Edit `package.json`
2. Commit and push
3. Auto-deploys with new dependencies

## 💡 Best Practices

1. **Always test locally first** - Run `npm run dev` before deploying
2. **Use auto-deployment** - Let GitHub Actions handle it
3. **Monitor weekly** - Run `./monitor.sh` once a week
4. **Keep backups** - Backup `.env` and database
5. **Update regularly** - Keep dependencies updated
6. **Check logs** - Review logs after deployment
7. **Use .env for secrets** - Never commit API keys to Git

## 📞 Support Contacts

- **Docker Issues:** Check logs with `docker-compose logs -f`
- **Nginx Issues:** Check `docker-compose logs nginx`
- **SSL Issues:** Run `./setup-ssl.sh` again
- **General Issues:** See DEPLOYMENT_GUIDE.md troubleshooting section

## ✅ Deployment Checklist

Before going live:

- [ ] `.env` file configured with real values
- [ ] Resend API key added
- [ ] Domain DNS pointing to server IP
- [ ] Firewall ports 80, 443 open
- [ ] SSL certificate generated
- [ ] GitHub Actions secrets configured
- [ ] Test deployment works
- [ ] Contact form sends emails
- [ ] Website loads on HTTPS
- [ ] Auto-deployment working

## 🎓 Learning Resources

- **Docker:** https://docs.docker.com/get-started/
- **Nginx:** https://nginx.org/en/docs/beginners_guide.html
- **Let's Encrypt:** https://letsencrypt.org/docs/
- **GitHub Actions:** https://docs.github.com/en/actions
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

**Your production deployment is ready!** 🚀

For detailed instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
For simple usage, see [QUICK_START.md](QUICK_START.md)
