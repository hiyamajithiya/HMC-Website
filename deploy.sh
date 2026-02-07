#!/bin/bash
set -e
echo "🚀 Starting deployment..."
cd /var/www/himanshumajithiya.com
cp .env .env.backup
echo "📥 Pulling from git..."
git stash && git pull
echo "🔨 Building..."
npm run build
echo "📂 Copying files..."
cp -r .next/static .next/standalone/.next/
rsync -a --exclude='uploads' public/ .next/standalone/public/
cp .env .next/standalone/.env
echo "▶️  Restarting..."
pm2 restart himanshumajithiya --update-env
echo "🎉 Done! Website is live."
