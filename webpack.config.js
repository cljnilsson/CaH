const
	path 				= require("path"),
	HtmlWebPackPlugin 	= require("html-webpack-plugin"),
	threadLoader 		= require("thread-loader");



const fileSettings =
{
	rules: [
		{
			test: /\.(js|jsx)$/,
			exclude: /node_modules|server|public/,
			use: {
				loader: "babel-loader?optional=runtime&cacheDirectory=true",
				options: {
					plugins: [
						["@babel/plugin-proposal-class-properties", { loose: false }],
						"@babel/plugin-transform-runtime"
					]
				}
			}
		},
		{
			test: /\.css$/,
			use: ['style-loader', 'css-loader'],
		},
		{
			test: /\.(png|jpg|gif|webm)$/,
			use: [
				{
					loader: "file-loader",
					options: {
						name: "[name].[ext]"
					}
				}
			]
		}
	]
};

const plugins = [
	new HtmlWebPackPlugin({
		hash: true,
		filename: "index.html",  //target html
		template: "./client/html/index.html" //source html
	})
];

module.exports = {
	devtool: "source-map",
	entry: "./client/index.js",
	performance: { hints: false },
	resolve: {
		extensions: [".jsx", ".js"]
	},
	output: {
		path: path.join(__dirname, "/public"),
		filename: "index_bundle.js"
	},
	watch: true,
	stats: "minimal",
	module: fileSettings,
	optimization: {
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: false,
	},
	plugins
};