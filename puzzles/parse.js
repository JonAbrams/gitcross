#!/usr/bin/env node
var fs = require('fs');
var url = require('url');
var data = require('./list.json');
var request = require('request');
var items = [];
data.forEach(function(item, index){
  var u = url.parse(item.images, true);
  var item = {
    username: item.username,
    name: item.name,
    gravatar: u.protocol +'//'+ u.host + u.pathname +'?s=300',
    identicon: u.query.d
  };
  items.push(item);
  request({ url: item.gravatar, encoding: null }, function (error, response, body) {
    fs.writeFile('./media/gravatar/'+ item.username +'.jpg', body, function() {
      console.log('G:'+ item.username);
    });
  });
  request({ url: item.identicon, encoding: null }, function (error, response, body) {
    fs.writeFile('./media/identicon/'+ item.username +'.png', body, function() {
      console.log('I:'+ item.username);
    });
  });
});
fs.writeFile('./users.json', JSON.stringify(items, null, 2), function() {
  console.log('all set');
});
