const { defineConfig } = require('@vue/cli-service')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const isAnalyzeMode = process.env.APP_MODE === 'analyzeMode'

module.exports = defineConfig({
  publicPath: './',
  transpileDependencies: true,
  configureWebpack: config => {
    if(isAnalyzeMode) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
      }))
    }
    config.optimization.splitChunks = {
      maxInitialRequests: Infinity,
      minSize: 300 * 1024,
      chunks: 'all',
      cacheGroups: {
        eleVendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'element-plus'
        }
      }
    }
  }
})
