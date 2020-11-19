const webpack = require('webpack'),
			path = require('path'),
			env = require('yargs').argv.env,
			pkg = require('./package.json'),
			autoprefixer = require('autoprefixer'),
			svgo = require('svgo-loader'),
			TerserPlugin = require('terser-webpack-plugin'),
			MiniCssExtractPlugin = require('mini-css-extract-plugin'),
			OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
			HtmlWebpackPlugin = require('html-webpack-plugin'),
			url = "https://coreytegeler.com/followyourwaste/";
let mode, outputJS;

if(env === 'build') {
	mode = 'production';
	outputJS = 'script.min.js';
} else {
	mode = 'development';
	outputJS = 'script.js';
}

const config = {
	mode: mode,
	entry: [__dirname + '/src/script.js'],
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname + '/dist'),
		filename: outputJS,
		library: 'fyw',
		libraryTarget: 'umd',
		umdNamedDefine: true,
	},
	module: {
		rules: [
			{
				test: /(\.jsx|\.js)$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/
			},
			{
				test: /(\.jsx|\.js)$/,
				loader: 'eslint-loader',
				exclude: /node_modules/
			},
			{
				test: /(\.scss|\.sass)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader', options: {
							sourceMap: true,
							// modules: true,
							// localIdentName: '[local]_[hash:base64:5]'
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							config: {
								path: 'postcss.config.js'
							}
						}
					},
					{
						loader: 'sass-loader', options: { sourceMap: true }
					}
				]
			},
			{
				test: /\.svg/,
				use: [
					{
						loader: 'svg-url-loader'
					}
				]
			},
			{ 
				test: /\.pug$/,
				use: ["pug-loader"]
			},
		]
	},
	resolve: {
		modules: [path.resolve('./node_modules'), path.resolve('./src')],
		extensions: ['.json', '.js']
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: env === 'build' ? 'style.min.css' : 'style.css',
			chunkFilename: '[id].css'
		}),
		new HtmlWebpackPlugin({
			minify: false,
			template: './src/index.pug',
			filename: '../index.html',
			data: require('./src/json/data.json'),
			text: require('./src/json/en.json'),
			lang: 'en',
			rootPath: env === 'build' ? url : './'
		}),
		new HtmlWebpackPlugin({
			minify: false,
			template: './src/index.pug',
			filename: '../es/index.html',
			data: require('./src/json/data.json'),
			text: require('./src/json/es.json'),
			lang: 'es',
			rootPath: env === 'build' ? url : '../'
		}),
		new HtmlWebpackPlugin({
			minify: false,
			template: './src/index.pug',
			filename: '../zh/index.html',
			data: require('./src/json/data.json'),
			text: require('./src/json/zh.json'),
			lang: 'zh-Hans',
			rootPath: env === 'build' ? url : '../'
		}),
		new HtmlWebpackPlugin({
			minify: false,
			template: './src/about.pug',
			filename: '../about/index.html',
			data: require('./src/json/data.json'),
			text: require('./src/json/zh.json'),
			lang: 'en',
			rootPath: env === 'build' ? url : '../'
		}),
		new HtmlWebpackPlugin({
			minify: false,
			template: './src/workers.pug',
			filename: '../workers/index.html',
			data: require('./src/json/data.json'),
			text: require('./src/json/en.json'),
			lang: 'en',
			rootPath: env === 'build' ? url : '../'
		}),
	],
	optimization: {
		minimize: env === 'build' ? true : false,
		minimizer: [
			new OptimizeCSSAssetsPlugin({}),
			new TerserPlugin()
		]
	}
};

module.exports = config;