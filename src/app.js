const { createApp } = require('./appFactory');

module.exports = createApp(process.env.APP_VERSION || 'v1');