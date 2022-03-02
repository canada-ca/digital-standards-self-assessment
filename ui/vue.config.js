// vue.config.js
module.exports = {
  publicPath: './',

  configureWebpack: {
    devtool: 'source-map',
  },

  transpileDependencies: ['vuex-persist', 'vue-i18n'],
};
