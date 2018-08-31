//css添加浏览器前缀
let cwd = process.cwd();
let path = require("path");
let glob = require("glob");
let webpack = require('webpack');
// let ExtractTextPlugin = require('extract-text-webpack-plugin');//使用MiniCssExtractPlugin代替
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let UglifyJsPlugin = require("uglifyjs-webpack-plugin");
let HtmlWebpackPlugin = require('html-webpack-plugin');
let LodashModuleReplacementPlugin = require('lodash-webpack-plugin'); //按需加载lodash
const CleanWebpackPlugin = require('clean-webpack-plugin'); //在生成新的构建之前，先清除旧的构建文件
const title = require('./data/title.json');
const isDev = process.env.NODE_ENV === 'development';
const LIVELOAD = process.env.LIVELOAD;
let files = glob.sync('**/page/*', { cwd: `${cwd}/src` });
let entry = {};
let file = Object.assign(files);
file.forEach((item) => {
  entry[`${item}/index`] = [`./src/${item}/index.jsx`];
});
let config = {
  context:cwd,
	entry,
	output :{
		path:path.resolve(process.env.BUILD_DEST || 'build'),
		filename: '[name].js',
        //HtmlWebpackPlugin生成的html里引入绝对路径的js
		publicPath: "/build",
		chunkFilename: '[chunkhash].js'
	},
	resolve: {
	    extensions: ['.js', '.jsx'],
	    alias: {
	      page: path.join(__dirname, 'src/page'),
        utils: path.join(__dirname, 'src/utils'),
        styles: path.join(__dirname, 'src/styles'),
        common: path.join(__dirname,'src/common'),
        components: path.join(__dirname, 'src/components')
	    }
  	},
    module:{
        rules:[ //加载loader
            {
                test:/\.jsx?$/,              //正则匹配 js 文件变化
                exclude:/node_modules/,
                 use: {
                  loader: 'babel-loader',
                  options: {
                    plugins: ['transform-runtime', 'lodash'],
                    presets: ['react','es2015','stage-2']
                  }
                }   
            },
            {
                test:/\.scss$/,
                use: [{
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    minimize: true
                  }
                },
                "css-loader",
                "sass-loader",
                // "postcss-loader"
              ]
            },
            {
                test:/\.css$/,
                use: [{
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    minimize: true
                  }
                },
                "css-loader"
              ]
            }
        ]
    },
    optimization: { //自动识别是否是生产环境
        minimizer: [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true 
          }),
          // new OptimizeCSSAssetsPlugin({})  // use OptimizeCSSAssetsPlugin css压缩
        ],
         splitChunks: { //公共代码提取
          cacheGroups: {
            commons: {
              name: 'commons',
              chunks: 'initial',
              minChunks: 2
            }
          }
        }
    },
  	plugins:[
        new MiniCssExtractPlugin({
          filename: "[name].bundle.css",
          // chunkFilename: "css/[name].[hash:6].css",
        }),
        new CleanWebpackPlugin(['build'])
        // new LodashModuleReplacementPlugin({
        //   path: true,
        //   flattening: true
        // })
        // new webpack.HotModuleReplacementPlugin(), //热更新
        // new webpack.NamedModulesPlugin() //热更新
        // new ExtractTextPlugin({
        //   filename: '[name].bundle.css',
        //   allChunks: true
        // }),
    ]
}
// if ((LIVELOAD && LIVELOAD !== 0) && LIVELOAD !== '0') {
//   Object.keys(config.entry).forEach((key) => {
//     config.entry[key].unshift('webpack-dev-server/client?/');
//   });
// }
// if (isDev) {
//   config.devServer = {
//     host: 'localhost',    // 服务器的IP地址，可以使用IP也可以使用localhost
//     // contentBase:path.resolve(__dirname,'industry'), 
//     compress: true,    // 服务端压缩是否开启
//     port: 3001, // 端口
//     hot: true,
//     inline:true,
//     open: true
//   }
// }
let pages = Object.keys(entry);
file.forEach(function(name,index){
     // //获取对应html文件名
     let htm = name.split("/")[1];
     // config.entry["../industry/"+htm+".html"] = pages;
	// console.log(entry);
     // 每个页面生成一个html
    let plugin = new HtmlWebpackPlugin({
         // 生成出来的html文件名
        filename: "../industry/"+htm+".html",
         // 每个html的模版，这里多个页面使用同一个模版
        template: './src/templates/index.html',
         // 自动将引用插入html
        inject: true,
        title:[htm, title],
         //每个html页面引入对应的html
        chunks: [pages[index],'commons'],
         // 每个html引用的js模块，也可以在这里加上vendor等公用模块
         // chunks: [name,'commons'],
        hash:true,//防止缓存
        minify:{
            removeAttributeQuotes:true//压缩 去掉引号
        }
     });
     config.plugins.push(plugin);
});
module.exports = config;