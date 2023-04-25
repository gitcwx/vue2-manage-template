// gzip压缩插件
const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
    // 根据环境配置项目名
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    outputDir: 'dist',
    // 保存时是否eslint检查
    lintOnSave: true,
    productionSourceMap: true,
    devServer: {
        // host: '127.0.0.1',
        port: 9090,
        // https: false,
        open: true,
        proxy: {
            '/api': {
                target: 'http://api.xxxx.com',
                ws: true,
                changeOrigin: true,
                logLevel: 'debug',
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    },
    css: {
        loaderOptions: {
            // 全局css变量/函数
            sass: {
                additionalData: '@import "~@/assets/css/variables.scss";'
            }
        }
    },
    configureWebpack: config => {
        const plugins = []

        // GZIP压缩
        plugins.push(
            new CompressionPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                threshold: 8192,
                minRatio: 0.8
            })
        )

        config.plugins = [...config.plugins, ...plugins]
    },
    chainWebpack (config) {}
}
