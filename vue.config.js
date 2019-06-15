const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

module.exports = {

    devServer: {
        open: true,
        host: 'localhost',
        port: 8080,
        https: false,
        //以上的ip和端口是我们本机的;下面为需要跨域的
        proxy: { //配置跨域
            '/api': {
                target: 'http://localhost:3001', //这里后台的地址模拟的;应该填写你们真实的后台接口
                ws: true,
                changOrigin: true, //允许跨域
                pathRewrite: {
                    '^/api': '' //请求的时候使用这个api就可以
                }
            }

        }
    },

    configureWebpack: {

        externals: {
            'vue': 'Vue',
            'vuex': 'Vuex',
            'vue-router': 'VueRouter',
            'element-ui': 'ELEMENT',
            'axios': 'axios'
        },

        plugins: [
            new CompressionWebpackPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            })
        ]
    },


}