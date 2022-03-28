const {
	override,
	fixBabelImports,
	addLessLoader, // less配置函数
	adjustStyleLoaders
} = require("customize-cra");
const path = require("path");

module.exports = override(
	fixBabelImports("import", {
			libraryName: "antd-mobile",
			style: true
		},
		{
			libraryName: "antd-mobile-v5",
			style: true
		},
		{
			libraryName: "antd",
			style: true
		}),
	addLessLoader({
		javascriptEnabled: true
	}),
	// 修改 less 配置
	adjustStyleLoaders((item) => {
		if (item.test.toString().includes("less")) {
			item.use.push({
				loader: "style-resources-loader",
				options: {
					patterns: path.resolve(__dirname, "src/assets/global.less")
				}
			});
		}
	})
);
