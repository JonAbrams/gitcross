// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('j6GA1vh6CcFjggoW');
var express = require('express');

var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var port = (isProduction ? 80 : 8000);

var app = express();

app.configure(function () {
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.use(express.compress());
  app.use(express.static(__dirname + "/public"));
  app.use(express.favicon());
  app.use(express.logger("dev"));
  app.use(require('asset-pipeline')({
    server: app,
    extensions: [".js", ".css", ".html"]
  }));
  app.use(app.router);
});

app.configure("development", function () {
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

app.get("/", function (req, res) {
  res.render("index", {
    title: "identiPicross",
    voteko: '<iframe src="http://nodeknockout.com/iframe/throw-42" frameborder=0 scrolling=no allowtransparency=true width=115 height=25></iframe>'
  });
});

http.createServer(app).listen(port, function(err) {
  if (err) { console.error(err); process.exit(-1); }

  // if run as root, downgrade to the owner of this file
  if (process.getuid() === 0) {
    require('fs').stat(__filename, function(err, stats) {
      if (err) { return console.error(err); }
      process.setuid(stats.uid);
    });
  }

  console.log('Server running at http://0.0.0.0:' + port + '/');
});
