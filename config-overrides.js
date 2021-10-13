module.exports = (config) => {
    const refreshPlugin = config.plugins.find((plugin) => plugin?.constructor?.name === 'ReactRefreshPlugin')
  
    if (refreshPlugin) {
      refreshPlugin.options.overlay = false
    }
  
    return config
  }