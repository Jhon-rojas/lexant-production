module.exports = {
  apps : [{
    name: 'SERVER',
    script: 'index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      key: "~/.ssh/id_rsa.pub",
      user : 'root',
      host : '80.211.131.29',
      ref  : 'origin/master',
      repo : 'git@github.com:Jhon-rojas/lexant-production.git',
      // "pre-deploy-local" : "git add . && git commit -a -m 'commit' && git push",
      path : '/var/www/production',
      'post-deploy' : 'pm2 reload ecosystem.config.js --env production'
    }
  }
};
