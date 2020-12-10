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
			url = "https://coreytegeler.com/follow-your-waste/";
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
	entry: [path.resolve(__dirname, 'src/script.js')],
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
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
		],
	},
	resolve: {
		modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src')],
		extensions: ['.json', '.js']
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: env === 'build' ? 'style.min.css' : 'style.css',
			chunkFilename: '[id].css'
		}),
		new HtmlWebpackPlugin({
			// minify: false,
			// template: path.resolve(__dirname, 'src/index.pug'),
			template: './src/index.pug',
			filename: path.resolve(__dirname, 'index.html'),
			data: require(path.resolve(__dirname, 'src/json/data.json')),
			text: require(path.resolve(__dirname, 'src/json/en.json')),
			lang: 'en',
			rootPath: env === 'build' ? url : './',
			// showErrors: true,
			// cache: false
		}),
	],
	// ].concat(entryHtmlPlugins)
	optimization: {
		minimize: env === 'build' ? true : false,
		minimizer: [
			new OptimizeCSSAssetsPlugin({}),
			new TerserPlugin()
		],
	},
};

// const entryHtmlPlugins = Object.keys(entry.html).map(entryName => {
//     return new HtmlWebpackPlugin({
//         filename: `${entry.html[entryName]}.html`,
//         template: `./source/templates/containers/${entryName}/${entryName}.pug`,
//         chunks: [entryName],
//         file: require(`../source/templates/containers/${entryName}/${entryName}.json`)
//     })
// });

module.exports = config;