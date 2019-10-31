module.exports = (env) => {
    if (env && env.NODE_ENV === 'production') {
      return require('./prod.config.js');
    } else {
      return require('./dev.config.js');
    }
  }