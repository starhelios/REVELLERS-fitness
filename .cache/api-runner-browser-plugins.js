module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"revel-well","short_name":"revwell","start_url":"/","background_color":"#663399","theme_color":"#663399","display":"minimal-ui","icon":"src/images/logo_light.png","cache_busting_mode":"query","include_favicon":true,"legacy":true,"theme_color_in_head":true,"cacheDigest":"0a610249cbefc16a049d769ac2d6b09c"},
    },{
      plugin: require('../node_modules/gatsby-plugin-netlify-identity/gatsby-browser.js'),
      options: {"plugins":[],"url":"https://pensive-galileo-93ca02.netlify.app"},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
