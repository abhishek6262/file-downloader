const withCSS = require("@zeit/next-css")

module.exports = withCSS({
  serverRuntimeConfig: {
    // This will only be available on the server-side
    MONGO_DB_NAME: 'file-downloader',
    MONGO_DSN: 'mongodb+srv://abhishek:prIN6262@ce@cluster0-njdje.mongodb.net/test?retryWrites=true',
  },
})
