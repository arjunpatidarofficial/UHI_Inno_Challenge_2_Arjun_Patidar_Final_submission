const plugins = [require('tailwindcss'), require('autoprefixer')]

if (process.env.NODE_ENV === 'production') {
    const purgecss = require('@fullhuman/postcss-purgecss')({
        content: ['./src/**/*.js'],
        defaultExtractor: function(content) {
            return content.match(/[\w-/:]+(?<!:)/g) || [];
        }
    })
    plugins.push(purgecss)

    const cssnano = require("cssnano")({
        preset: 'default'
    })
    plugins.push(cssnano);
}

module.exports = {
    plugins: plugins
}