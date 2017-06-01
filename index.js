"use strict"

function CdnPathWebpackPlugin(options) {
  this.options = options

  // js里面动态调用拼接的，根据 __webpack_public_path__ 来的
  this.runtimeCdnPath = options && options.runtimeCdnPath

  // 构造生成html使用的资源
  this.assetsJsCdnPath = options && options.assetsJsCdnPath
  this.assetsCssCdnPath = options && options.assetsCssCdnPath

  if (
    (this.runtimeCdnPath && !Array.isArray(this.runtimeCdnPath))
    || (this.assetsJsCdnPath && !Array.isArray(this.assetsJsCdnPath))
    || (this.assetsCssCdnPath && !Array.isArray(this.assetsCssCdnPath))
  ) {
    throw new Error('runtimeCdnPath,assetsJsCdnPath,assetsCssCdnPath must be an array')
  }
}

CdnPathWebpackPlugin.prototype.apply = function (compiler) {
  var self = this
  const jsCdnPathLength = this.assetsJsCdnPath.length
  const cssCdnPathLength = this.assetsCssCdnPath.length
  var jsCdnPathIndex = 0
  var cssCdnPathIndex = 0

  compiler.plugin('compilation', function (compilation, options) {

    compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData, callback) {
      if (self.assetsJsCdnPath) {
        htmlPluginData.assets.js = htmlPluginData.assets.js.map(function (item) {
          // item 的地址已经包含了 htmlPluginData.assets.publicPath 了
          // console.log(self.assetsJsCdnPath[jsCdnPathIndex++ % jsCdnPathLength] + "   " + htmlPluginData.assets.publicPath + "   " + item + "\n")
          return (jsCdnPathLength == 1 ? self.assetsJsCdnPath[0] : self.assetsJsCdnPath[jsCdnPathIndex++ % jsCdnPathLength]) + item
          // return this.assetsJsCdnPath[jsCdnPathIndex++ % length] + htmlPluginData.assets.publicPath + item
        })
      }

      if (self.assetsCssCdnPath) {
        htmlPluginData.assets.css = htmlPluginData.assets.css.map(function (item) {
          // item 的地址已经包含了 htmlPluginData.assets.publicPath 了
          // console.log(self.assetsCssCdnPath[cssCdnPathIndex++ % cssCdnPathLength] + "   " + htmlPluginData.assets.publicPath + "   " + item + "\n")
          return (cssCdnPathLength == 1 ? self.assetsCssCdnPath[0] : self.assetsCssCdnPath[cssCdnPathIndex++ % cssCdnPathLength]) + item
          // return this.assetsCssCdnPath[index++ % length] + htmlPluginData.assets.publicPath + item
        })
      }

      callback(null, htmlPluginData)
    })

    // 下面这部分是前端调用的时候使用的，前端没办法区分要拼接的资源类型。所以是统一的
    if (self.runtimeCdnPath) {
      compilation.mainTemplate.plugin('require-extensions', function (source, chunk, hash) {
        const publicPath = this.getPublicPath({
          hash: hash
        })

        let runtimePublicPath = self.runtimeCdnPath.length == 1 ? `'${self.runtimeCdnPath[0]}'`
          : `${JSON.stringify(self.runtimeCdnPath)}[Math.floor((Math.random()*${self.runtimeCdnPath.length}))]`
        runtimePublicPath += `+'${publicPath}'`

        const buf = []
        buf.push(source)
        buf.push('')
        buf.push('// publicPath override (html-webpack-cdn-path-plugin)')
        buf.push(this.requireFn + '.p = (' + runtimePublicPath + ') || ' + this.requireFn + '.p;')

        return this.asString(buf)
      })
    }

  })

}

module.exports = CdnPathWebpackPlugin