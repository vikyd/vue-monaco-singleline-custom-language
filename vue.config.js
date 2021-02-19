const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  chainWebpack: config => {
    // needed this for completion can work
    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      {
        // Languages are loaded on demand at runtime
        // https://github.com/FE-Mars/monaco-editor-vue
        // languages: ["json", "typescript", "javascript", "html", "xml"],
      },
    ])
  },
}
