#!/usr/bin/env node
var fs = require('fs');
var url = require('url');
var request = require('request');
var pngparse = require("pngparse");
var async = require("async");

var data = require('./list.json');

var requests = [];
var items = [];
data.forEach(function(item, index){
  var u = url.parse(item.images, true);
  var item = {
    username: item.username,
    name: item.name,
    gravatar: u.protocol +'//'+ u.host + u.pathname +'?s=300',
    identicon: u.query.d
  };
  var getGravatar = function(done) {
    request({ url: item.gravatar, encoding: null }, function (error, response, body) {
      if (error) { done(done); }
      fs.writeFile('./media/gravatar/'+ item.username +'.jpg', body, function() {
        console.log('G:'+ item.username);
        done(null);
      });
    });
  };
  requests.push(getGravatar);
  var getIdenticon = function(done) {
    request({ url: item.identicon, encoding: null }, function (error, response, body) {
      if (error) { done(done); }
      var arr = [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
      ];
      pngparse.parse(body, function(err, data) {
        if (err) { return console.error(err); }
        for (var y = 70, row = 0; y < 420 ; y += 70, row++) {
          for (var x = 70, col = 0; x < 420 ; x += 70, col++) {
            if (data.getPixel(x, y) !== 4042322175) {
              arr[row][col] = 1;
            }
          }
        }
        item.puzzle = arr;
      });
      fs.writeFile('./media/identicon/'+ item.username +'.png', body, function() {
        console.log('I:'+ item.username);
        items.push(item);
        done();
      });
    });
  };
  requests.push(getIdenticon);
});

//save the users file
async.parallel(requests, function() {
  fs.writeFile('./users.json', JSON.stringify(items, null, 2), function() {
    console.log('all set');
  });
});
