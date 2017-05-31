# html-webpack-cdn-path-plugin

Works with Webpack 2.


## Installation
``` sh
npm i html-webpack-cdn-path-plugin --save-dev
```


## Use
webpack.config.js:

``` javascript
const CdnPathWebpackPlugin = require("html-webpack-cdn-path-plugin");

module.exports = {
    entry: {
        app: ['./main.js'],
    },
    output: {
        filename: '[name].js',
        path: '.dist/',
        publicPath: '/'
    },
    plugins: [
        new CdnPathWebpackPlugin({
            runtimeCdnPath: ['//cdn1.static.com','//cdn2.static.com'],
            assetsJsCdnPath: ['//cdn1.static.com','//cdn2.static.com'],
            assetsCssCdnPath: ['//cdn1.static.com','//cdn2.static.com'],
	    })
    ]
}
```


## Result

### 1. manifest (use runtimeCdnPath)
```js
/******/        // __webpack_public_path__
/******/        __webpack_require__.p = "/";

/******/        // publicPath override (html-webpack-cdn-path-plugin)
/******/        __webpack_require__.p = (["//cdn1.static.com","//cdn2.static.com"][Math.floor((Math.random()*2))]+'/') || __webpack_require__.p; // cdn + publicPath
```
### 2. assets js,css
```js
jsUrl = randomAssetsJsCdnPathStr + output.publicPath + output.filename
cssUrl = randomAssetsCssCdnPathStr + output.publicPath + output.filename
```


## License
The [MIT License](LICENSE).


## Thank
- [webpack-runtime-public-path-plugin](https://www.npmjs.com/package/webpack-runtime-public-path-plugin)
- [dynamic-public-path-webpack-plugin](https://www.npmjs.com/package/dynamic-public-path-webpack-plugin)
