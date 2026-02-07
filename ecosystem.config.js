module.exports = {
  apps: [
    {
      name: 'hmc-website',
      // Next.js standalone server
      script: '.next/standalone/server.js',
      cwd: '/var/www/hmc-website',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      // DO NOT watch files - builds will crash PM2 otherwise
      watch: false,
      // Auto-restart only on crash, not during builds
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      // Graceful shutdown
      kill_timeout: 10000,
      listen_timeout: 15000,
      // Logging
      error_file: '/var/log/hmc-website/error.log',
      out_file: '/var/log/hmc-website/output.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      // Memory management
      max_memory_restart: '500M',
    },
  ],
}
