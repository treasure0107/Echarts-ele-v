/*
 * @Descripttion:webpack打包优化
 * @Author: JTune
 * @Date: 2020-11-18 11:13:09
 */
// 代码压缩
const TerserPlugin = require('terser-webpack-plugin');

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');

// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development';

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/power_web/' : '/',
  devServer: {
    open: true
  },
  productionSourceMap: false,
  // 全局引入公共样式变量
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/styles/variables.scss";`
      }
    }
  },

  // chainWebpack: config => {
  // ============压缩图片 start============
  // config.module
  //   .rule('images')
  //   .use('image-webpack-loader')
  //   .loader('image-webpack-loader')
  //   .options({ bypassOnDebug: true })
  //   .end();
  // ============压缩图片 end============

  // 查看打包文件体积大小

  // config
  //   .plugin('webpack-bundle-analyzer')
  //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  // },
  configureWebpack: config => {
    // 生产环境相关配置
    if (isProduction) {
      // 代码压缩
      config.optimization = {
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              ecma: undefined,
              warnings: false,
              parse: {},
              compress: {
                drop_console: true,
                drop_debugger: false,
                pure_funcs: ['console.log'] // 移除console
              }
            }
          })
        ]
      };

      // gzip压缩
      const productionGzipExtensions = ['html', 'js', 'css'];
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' + productionGzipExtensions.join('|') + ')$'
          ),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      );

      // 公共代码抽离
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: 'all',
              test: /node_modules/,
              name: 'vendor',
              minChunks: 1,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 100
            },
            common: {
              chunks: 'all',
              test: /[\\/]src[\\/]js[\\/]/,
              name: 'common',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 60
            },
            styles: {
              name: 'styles',
              test: /\.(sa|sc|c)ss$/,
              chunks: 'all',
              enforce: true
            },
            runtimeChunk: {
              name: 'manifest'
            }
          }
        }
      };
    }
  }
};
