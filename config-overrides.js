const path = require('path')
const { override, addLessLoader, adjustStyleLoaders, fixBabelImports } = require('customize-cra')

module.exports = {
  webpack: override(
    fixBabelImports('import', {
      libraryName: 'antd-mobile',
      style: true
    }),
    // 配置less
    addLessLoader({
      javascriptEnabled: true // 启用支持内联javascript
    }),
    // 修改 less 配置
    adjustStyleLoaders(item => {
      if (item.test.toString().includes('less')) {
        item.use.push({
          loader: 'style-resources-loader',
          options: {
            patterns: path.resolve(__dirname, 'src/assets/global.less')
          }
        })
      }
    })
  )
}
