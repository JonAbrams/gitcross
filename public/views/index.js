var puzzle;
var rowClues;
var colClues;

function createPixel (state, id) {
  return {
    chosen: state == 1,
    flagged: state == 2,
    id: id
  };
}

function createRow (rawRow, rowIndex) {
  return {
    pixels: rawRow.map(function (state, colIndex) {
      return createPixel(state, rowIndex + colIndex);
    })
  };
}

function sameRow (row1, row2) {
  var arr1 = row1.pixels;
  var arr2 = row2.pixels;
  if (row1.length != row2.length) return false;
  for (var i = 0; i < row1.length; i++) {
    if (arr1[i].chosen != arr2[i].chosen) return false;
  }
  return true;
}

function createClue (num) {
  return {
    completed: false,
    num: num
  };
}

function clues (series) {
  var clueArr = [];
  var current = 0;
  for (var i = 0; i < series.length; i++) {
    if (series[i].chosen) {
      current++;
    } else if (current) {
      clueArr.push( createClue(current) );
      current = 0;
    }
  }
  if (current > 0 || clueArr.length === 0) {
    clueArr.push( createClue(current) );
  }
  return clueArr;
}

function createPuzzle (rawPuzzle) {
  return {
    rows: rawPuzzle.map(function (rawRow, rowIndex) {
      return createRow(rawRow, String.fromCharCode(65 + rowIndex));
    }),
    size: rawPuzzle.length
  };
}

function samePuzzle (puzzle1, puzzle2) {
  var arr1 = this.rows;
  var arr2 = puzzle.rows;
  if (puzzle1.size != puzzle2.size) return false;
  for (var i = 0; i < puzzle1.size; i++) {
    if (!sameRow(arr1[i], arr2[i])) return false;
  }
  return true;
}

function rotate (puzzle) {
  var rot = [];

  for (var i = 0; i < puzzle.size; i++) {
    var col = [];
    for (var j = 0; j < puzzle.size; j++) {
      var state = (puzzle.rows[j].pixels[i].chosen) ? 1 : 0;
      col.unshift(state);
    }
    rot.push(col);
  }
  return createPuzzle(rot);
}

function updateClueStatus (puzzle) {
  function clearRow (row) {
    row.forEach(function (clue) {
      clue.completed = false;
    });
  }
  // Rows
  puzzle.rows.forEach(function (row, index) {
    var guess = clues(row.pixels);
    clearRow(rowClues[index]);
    var size = guess.length < rowClues[index].length ? guess.length : rowClues[index].length;
    for (var j = 0; j < size; j++) {
      var clue = rowClues[index][j];
      clue.completed = clue.num == guess[j].num;
    }
  });
  // Columns
  rotate(puzzle).rows.forEach(function (row, index) {
    var guess = clues(row.pixels).reverse();
    var size = guess.length < colClues[index].length ? guess.length : colClues[index].length;
    clearRow(colClues[index]);
    var col = _(colClues[index]).clone().reverse();
    for (var j = 0; j < size; j++) {
      var clue = col[j];
      clue.completed = clue.num == guess[j].num;
    }
  });
}

function puzzleDone () {
  var done = true;
  [rowClues, colClues].forEach(function (rows) {
    rows.forEach(function (row) {
      row.forEach(function (clue) {
        done = done && clue.completed;
      });
    });
  });
  return done;
}

angular.module("gitcross", [])
.controller("PuzzleCtrl", function ($scope, $http, $timeout, goinstant) {
  var time, timer;
  function newGame (difficulty) {
    if (timer) $timeout.cancel(timer);
    $http.get("/puzzles/?size=" + difficulty).then(function (res) {
      $scope.done = false;
      $scope.time = 0;

      puzzle = createPuzzle(res.data.puzzle);

      $scope.githubbers = res.data.sources;

      rowClues = puzzle.rows.map(function (row) {
        return clues(row.pixels);
      });

      colClues = rotate(puzzle).rows.map(function (row) {
        return clues(row.pixels);
      });

      // Variables
      var rawChoices = [];
      for (var i = 0; i < puzzle.size; i++) {
        var row = [];
        for (var j = 0 ; j < puzzle.size; j++) {
          row.push(0);
        }
        rawChoices.push(row);
      }
      $scope.myChoices = createPuzzle(rawChoices);

      $scope.rowClues = rowClues;

      $scope.colClues = colClues;

      var startTimer = function () {
        timer =  $timeout(function () {
          $scope.time += 1000;
          startTimer();
        }, 1000);
      };
      startTimer();
    });
  }

  $scope.choosePixel = function (pixel) {
    if (pixel.flagged || $scope.done) return;
    pixel.chosen = !pixel.chosen;
  };

  $scope.flagPixel = function (pixel) {
    if ($scope.done) return;
    if (pixel.chosen) {
      pixel.chosen = false;
    }
    pixel.flagged = !pixel.flagged;
  };

  goinstant.registerObserver(function () {
    $scope.$apply(function () {
      $scope.players = goinstant.usersInLobby();
    });
  });

  $scope.self = goinstant.self;

  $scope.setName = goinstant.setName;

  $scope.newGame = newGame;

  $scope.$watch("myChoices", function () {
    if ($scope.myChoices) {
      updateClueStatus($scope.myChoices);
      $scope.done = puzzleDone();
      if ($scope.done) {
        $timeout.cancel(timer);
      }
    }
  }, true);

  $scope.$watch(function () {
    $('[rel="tooltip"]').tooltip();
  });

  // Start the first game!
  newGame(1);
})
.filter('reverse', function () {
  return function (arr) {
    return _(arr).clone().reverse();
  };
})
.directive('ngRightClick', function($parse) {
  return function(scope, element, attrs) {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', function(event) {
        scope.$apply(function() {
            event.preventDefault();
            fn(scope, {$event:event});
        });
    });
  };
});

$(document).ready(function() {
  $('[rel="tooltip"]').tooltip();
});
