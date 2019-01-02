const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
entry : ['babel-polyfill','./src/js/index.js'],
output : {
    path :path.resolve(__dirname,'dist'),
    filename:'js/bundle.js'
},
devServer : {
    contentBase : './dist',
    disableHostCheck: true,
    port :8089
},
plugins : [
    new HtmlWebPackPlugin({
        filename :'index.html',
        template : './src/index.html'
    })
],
module :{
    rules :[{
        test : /\.js$/,
        exclude :/node_modules/,
        use:{
            loader : 'babel-loader'
        }
    }
]
}

};