module.exports = {
  apps: [
    {
      name: 'file-server',
      cwd: '/home/ubuntu/.openclaw/workspace/file-server',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '150M',  // 内存超150M自动重启
      node_args: '--max-old-space-size=128',  // 限制Node堆内存
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'xiaoniu-music',
      cwd: '/home/ubuntu/.openclaw/workspace/xiaoniu-music',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '150M',
      node_args: '--max-old-space-size=128',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
