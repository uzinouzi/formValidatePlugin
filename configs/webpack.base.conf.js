const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');


const PATHS = {
	src: path.join(__dirname, '../src'),
	dist: path.join(__dirname, '../dist'),
	js: 'js/bundle.js',
	css: 'css/style.css',
}

module.exports = {
	externals: {
		paths: PATHS,
	},
	entry: {
		app: PATHS.src,
	},
	output: {
		path: PATHS.dist,
		filename: PATHS.js,
		publicPath: '/',
	},
	module: {
		rules: [
		{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: '/node_modules/',
		}, 
		{
      test: /\.(jpe?g|png|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
						name: "img/[name].[ext]",
          }
        },
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 65
            },
            optipng: {
              enabled: false,
            },
            pngquant: {
              quality: '65-90',
              speed: 4
            },
            gifsicle: {
              interlaced: false,
            },
            svgo: {
              enabled: true,
            }
          }
        }
      ]
    },
    {
      //test: /\.svg$/,
      //use: [
      //  {
      //    loader: 'file-loader',
      //    options: {
      //      name: "img/[name].[ext]",
      //    }
      //  },
        //{
        //  loader: 'svgo-loader',
        //  options: {
        //    plugins: [
        //      {removeTitle: true},
        //    ]
        //  }
        //}
      //]
    },
		{
			test: /\.less$/,
      use: [
        {
        	loader: 'style-loader',
        },
        {
        	loader: MiniCssExtractPlugin.loader,
        }, 
        {
        	loader: "css-loader",
        	options: {
        		sourceMap: true,
        	}
        },
        {
        	loader: "postcss-loader",
        	options: {
        		sourceMap: true,
        		config:  {
        			path: 'configs/postcss.config.js',
        		}
        	}
        },
        {
        	loader: "less-loader",
        	options: {
						relativeUrls: false,
        		sourceMap: true,
        	}
        }
      ]
		},
		{
			test: /\.(eot|svg|ttf|woff|woff2)$/,
			exclude: '/node_modules/',
			use: [
				{
					loader: 'url-loader',
					options: {
            name: 'fonts/[name].[ext]',
						limit: 8192
					}
				}
			]
		},
		{
			test: /\.css$/,
			use: [
				{
        	loader: 'style-loader',
        },
        {
        	loader: MiniCssExtractPlugin.loader,
        }, 
        {
        	loader: "css-loader",
        	options: {
        		sourceMap: true,
        	}
        },
        {
        	loader: "postcss-loader",
        	options: {
        		sourceMap: true,
        		config:  {
        			path: 'configs/postcss.config.js',
        		}
        	}
				}
			]
		}]
	},
  	plugins: [
  	  new MiniCssExtractPlugin({
  	    filename: PATHS.css,
  	  }),
  	  new HtmlWebpackPlugin({
  	  	hash: false,
  	  	template: `${PATHS.src}/index.html`,
  	  	filename: 'index.html',
  	  }),
  	],
}
