const withCSS = require("@zeit/next-css")

module.exports = withCSS({
  publicRuntimeConfig: {
    // This will be available on both server and client
    APP_URL: 'http://localhost:3000',
    PUSHER_CLUSTER: 'ap2',
    PUSHER_EVENT_NAME: 'process-completion',
    PUSHER_KEY: 'a3eb00aefc621d324542',
  },

  serverRuntimeConfig: {
    // This will only be available on the server-side
    MAX_FAILED_ATTEMPTS: 5,
    MAX_SERVICE_WORKERS: 2,

    MONGO_DB_NAME: 'file-downloader',
    MONGO_DSN: 'mongodb+srv://abhishek:prIN6262@ce@cluster0-njdje.mongodb.net/test?retryWrites=true',

    PUSHER_APP_ID: '857977',
    PUSHER_SECRET: 'a4b130b9216541529ea7',
  },
})
