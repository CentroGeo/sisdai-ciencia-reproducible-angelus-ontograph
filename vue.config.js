const path = require("path");
const vueSrc = "./src";

module.exports = {
    devServer: {
        allowedHosts: "all",
    },
    configureWebpack: {
        resolve: {
            alias: {
                "~": path.resolve(__dirname, vueSrc)
            },
            extensions: ['.js', '.vue', '.json']
        }
    }

}