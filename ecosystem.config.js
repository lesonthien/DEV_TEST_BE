module.exports = {
  apps: [
    {
      name: 'api-sim-prod',
      exec_mode: 'cluster',
      instances: '1', // Or a number of instances
      script: 'dist/main.js',
      args: 'start',
    },
  ],
};
