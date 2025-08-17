module.exports = {
  watchOptions: {
    ignored: [
      '**/node_modules',
      '**/.git',
      '**/build',
      '**/dist',
      /DumpStack\.log\.tmp/,
      /pagefile\.sys/,
      /swapfile\.sys/
    ]
  }
};