module.exports = {
  apps: [{
    name: 'ifinance-app',
    script: 'yarn',
    args: 'dev',
    cwd: '/home/ubuntu/ifinance_app/nextjs_space',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    }
  }]
};
