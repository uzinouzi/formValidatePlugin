const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf.js');

const devWebpackConfig = merge(baseWebpackConfig, {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		contentBase: baseWebpackConfig.externals.paths.dist,
		port: 8081,
	},
	plugins: [
		new webpack.SourceMapDevToolPlugin({
			filename: 'sourcemap.map'
		}),
	]
})

module.exports = new Promise((resolve, reject) => {
	resolve(devWebpackConfig);
})