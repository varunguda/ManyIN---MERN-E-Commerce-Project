
module.exports = {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['es2015', { modules: false }]
                        ]
                    }
                }
            }
        ]
    },
    optimization: {
        usedExports: true,
    }
}
