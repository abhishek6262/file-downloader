const withCSS = require("@zeit/next-css")

module.exports = withCSS({
  env: {
    // This will be available on both server and client
    APP_NAME: 'Resume.io',
    APP_URL: 'http://localhost:3000',
    TRACK_DOWNLOAD_COMPLETION: 'process-completion',
  },

  serverRuntimeConfig: {
    // This will only be available on the server-side
    GMAIL_USERNAME: 'prakashabhishek6262@gmail.com',
    GMAIL_PASSWORD: 'n2KS@ny9',

    MAX_FAILED_ATTEMPTS: 5,
    MAX_SERVICE_WORKERS: 2,

    MONGO_DB_NAME: 'file-downloader',
    MONGO_DSN: 'mongodb+srv://abhishek:prIN6262@ce@cluster0-njdje.mongodb.net/test?retryWrites=true',
  },
})
