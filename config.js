'use strict';

var inProduction = process.env.NODE_ENV === 'production';
exports.port = (inProduction ? 80 : 8000);
exports.mongodb = {
  uri: (inProduction ? 'mongodb://throw42:d0ntf41Lu5!@ds045978.mongolab.com:45978/throw42' : 'localhost/throw42')
};
exports.companyName = 'Throw 42;';
exports.projectName = 'Gitcross';
exports.systemEmail = 'gitcrossmail@gmail.com';
exports.cryptoKey = 'h4ppy4tj0y3nt';
exports.smtp = {
  from: {
    name: process.env.SMTP_FROM_NAME || exports.projectName +' Website',
    address: process.env.SMTP_FROM_ADDRESS || 'gitcrossmail@gmail.com'
  },
  credentials: {
    user: process.env.SMTP_USERNAME || 'gitcrossmail@gmail.com',
    password: process.env.SMTP_PASSWORD || 'd0ntcr05Su5!',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    ssl: true
  }
};
exports.oauth = {
  twitter: {
    key: process.env.TWITTER_OAUTH_KEY || '',
    secret: process.env.TWITTER_OAUTH_SECRET || ''
  },
  facebook: {
    key: process.env.FACEBOOK_OAUTH_KEY || '',
    secret: process.env.FACEBOOK_OAUTH_SECRET || ''
  },
  github: {
    key: process.env.GITHUB_OAUTH_KEY || '40689d0a977116e9ed1a',
    secret: process.env.GITHUB_OAUTH_SECRET || 'cade4424608adc8987180c6d76f9a5d45984872b'
  }
};
