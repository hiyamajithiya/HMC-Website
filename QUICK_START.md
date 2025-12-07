# HMC Website - Quick Start Guide for Non-Coders

This is a simple guide for managing your website without coding knowledge.

## 🎯 What You Can Do Without Coding

1. **Update Website Content** - Just push to GitHub, it auto-deploys
2. **Manage Blog Posts** - Use Sanity CMS (coming soon) - like WordPress
3. **Receive Contact Form Messages** - Automatic emails to your inbox
4. **Update Tax Calculators** - Use simple text editor (VS Code)

## 📱 Daily Operations

### How to Update Website Content

**Option 1: Using GitHub Website (Easiest)**

1. Go to https://github.com/hiyamajithiya/HMC-Website
2. Log in to your account
3. Navigate to the file you want to edit
4. Click the pencil icon (✏️) to edit
5. Make your changes
6. Scroll down and click "Commit changes"
7. Wait 2-3 minutes - website updates automatically!

**Option 2: Using VS Code (For Bigger Changes)**

1. Open VS Code on your computer
2. Go to Source Control (left sidebar)
3. Click "Pull" to get latest changes
4. Edit files
5. Click "Commit" → Write message → Click "Sync"
6. Website updates automatically!

### How to Check If Website is Running

**Method 1: Visit Website**
- Just open https://himanshumajithiya.com in browser
- If it loads, everything is working!

**Method 2: Check GitHub Actions**
1. Go to https://github.com/hiyamajithiya/HMC-Website/actions
2. Look for green checkmarks ✅ = Success
3. Red X ❌ = Failed (contact developer)

**Method 3: Server Terminal (Advanced)**
```bash
ssh username@your-server-ip
cd /var/www/hmc-website
docker-compose ps
```

All services should show "Up" status.

## 📧 Email Setup - Contact Form

### Initial Setup (One Time Only)

1. Go to https://resend.com
2. Sign up with your email
3. Verify your email
4. Go to "API Keys" section
5. Click "Create API Key"
6. Name it "HMC Website"
7. Copy the key (starts with `re_`)
8. SSH into your server:
   ```bash
   ssh username@your-server-ip
   cd /var/www/hmc-website
   nano .env
   ```
9. Replace `your_resend_api_key_here` with the actual key
10. Save: Press `Ctrl + X`, then `Y`, then `Enter`
11. Restart:
    ```bash
    docker-compose restart web
    ```

### How Contact Form Works

1. **User fills form** on your website
2. **You receive email** at info@himanshumajithiya.com
3. **User receives confirmation** email
4. **You reply** directly from your email

No action needed - it's automatic!

### Troubleshooting Email

**Not receiving emails?**
1. Check spam folder
2. Verify Resend API key is correct
3. Check Resend dashboard for errors: https://resend.com

## 🔄 Common Updates

### Update Tax Calculator Rates

1. Open GitHub repository
2. Go to: `app/(main)/resources/calculators/income-tax/page.tsx`
3. Find the tax slabs section (around line 90-150)
4. Edit the numbers
5. Commit changes
6. Website updates automatically

**Example: Change tax rate from 30% to 32%**

Find this line:
```typescript
if (income > 1500000) tax += (income - 1500000) * 0.30  // 30%
```

Change to:
```typescript
if (income > 1500000) tax += (income - 1500000) * 0.32  // 32%
```

### Update Contact Information

1. Go to: `lib/constants.ts`
2. Edit phone numbers, addresses, emails
3. Commit changes
4. Auto-deploys!

### Update Homepage Content

1. Go to: `app/(main)/page.tsx`
2. Edit the text content
3. Don't change code in `<>` brackets
4. Only change text between tags
5. Commit changes

## 🚨 Emergency Commands

### Website is Down - Quick Restart

```bash
# SSH into server
ssh username@your-server-ip

# Go to website folder
cd /var/www/hmc-website

# Restart everything
docker-compose restart

# Wait 30 seconds and check website
```

### Website Still Down - Full Restart

```bash
# SSH into server
ssh username@your-server-ip

# Go to website folder
cd /var/www/hmc-website

# Stop everything
docker-compose down

# Start everything
docker-compose up -d

# Wait 1 minute and check website
```

### Check What's Wrong

```bash
# SSH into server
ssh username@your-server-ip

# Go to website folder
cd /var/www/hmc-website

# See error messages
docker-compose logs -f

# Press Ctrl+C to stop viewing logs
```

## 📊 Website Health Checklist

Run this weekly to ensure everything is working:

- [ ] Visit https://himanshumajithiya.com - loads correctly
- [ ] Visit https://www.himanshumajithiya.com - loads correctly
- [ ] Click around different pages - all work
- [ ] Fill contact form - email received
- [ ] Check GitHub Actions - all green checkmarks
- [ ] Income Tax Calculator - calculates correctly

## 🆘 When to Contact Developer

Contact your developer if:

- ❌ Website shows error page
- ❌ Contact form not sending emails for 24+ hours
- ❌ GitHub Actions showing red X repeatedly
- ❌ SSL certificate expired (browser shows "Not Secure")
- ❌ Calculator giving wrong results
- ❌ Server commands not working

**What to Send Developer:**

1. Screenshot of the error
2. What you were trying to do
3. Any error messages from logs:
   ```bash
   docker-compose logs -f > error.txt
   ```
4. Send `error.txt` file

## 💡 Pro Tips

1. **Always pull before editing** - Get latest changes first
2. **Test on staging first** - If you have a test environment
3. **Make small changes** - Easier to fix if something breaks
4. **Check GitHub Actions** - Make sure deployment succeeded
5. **Keep backup of .env file** - Store it securely offline

## 📞 Quick Reference

| Task | How To |
|------|--------|
| Update content | Edit on GitHub → Auto-deploys |
| Check website | Visit https://himanshumajithiya.com |
| Restart website | `docker-compose restart` |
| View errors | `docker-compose logs -f` |
| Update calculator | Edit `income-tax/page.tsx` |
| Contact form setup | Add Resend API key to `.env` |

## 🎓 Learn More

- **GitHub Basics:** https://guides.github.com/activities/hello-world/
- **Markdown Guide:** https://www.markdownguide.org/basic-syntax/
- **VS Code Tutorial:** https://code.visualstudio.com/docs/getstarted/introvideos

---

**Remember:** Most updates happen automatically via GitHub. You rarely need to SSH into the server!

**Need help?** Save this file and refer to it anytime. 📚
