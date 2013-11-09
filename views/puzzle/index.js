'use strict';

exports.init = function(req, res){
  var size = req.query.size ? parseInt(req.query.size, null) : 1;
  var game = [];
  for (var i = 0 ; i < size ; i++) {
    var randomPuzzle = Math.floor(Math.random() * req.app.puzzles.length) + 1;
    game.push(req.app.puzzles[randomPuzzle]);
  }
  res.send(game);
};
