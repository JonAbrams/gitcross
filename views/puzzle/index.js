'use strict';

exports.init = function(req, res, next){
  var size = req.query.size ? parseInt(req.query.size, null) : 1;
  if (size < 1 || size > 3) {
    return next(new Error('Invalid puzzle size.'));
  }
  
  var game = {
    puzzle: [],
    sources: []
  };
  for (var i = 0 ; i < Math.pow(size, 2) ; i++) {
    var randomUser = Math.floor(Math.random() * req.app.puzzles.length) + 1;
    game.sources.push(req.app.puzzles[randomUser]);
  }
  
  if (size === 1) {
    game.puzzle = game.sources[0].puzzle;
  }
  else {
    for (var j = 0 ; j < size * 5 ; j++) {
      game.puzzle[j] = [];
    }
    
    var set = 1;
    for (var k = 1 ; k <= game.sources.length ; k++) {
      for (var n = 5 ; n >= 1 ; n--) {
        var puzzleRow = (set * 5 - n);
        game.puzzle[puzzleRow] = game.puzzle[puzzleRow].concat(game.sources[k - 1].puzzle[5 - n]);
      }
      if (k % size === 0) {
        set++;
      }
    }
  }
  res.send(game);
};
