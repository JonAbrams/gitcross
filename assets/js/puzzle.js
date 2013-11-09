var rawPuzzle = [
  [1,1,1,0,1],
  [1,0,1,0,1],
  [0,1,1,0,0],
  [1,1,1,1,1],
  [0,0,0,0,0]
];

// Pixel Class
function Pixel (state) {
  this.state = state;
}
Pixel.prototype.chosen = function () {
  return this.state == 1;
};
Pixel.prototype.flagged = function () {
  return this.state == 2;
};
Pixel.prototype.toggleChosen = function () {
  if (!this.flagged()) {
    this.state ^= 1;
  }
};
Pixel.prototype.toggleFlagged = function () {
  if (!this.chosen()) {
    this.state ^= 2;
  }
};
Pixel.prototype.same = function (pixel) {
  return this.chosen() == pixel.chosen();
};

function Clue (num) {
  this.num = num;
}

function Row (rawRow) {
  this.pixels = rawRow.map(function (state) {
    return new Pixel(state);
  });
}
Row.prototype.raw = function () {
  return this.pixels.map(function (pixel) {
    return pixel.chosen() ? 1 : 0;
  });
};
Row.prototype.same = function (row) {
  var arr1 = this.pixels;
  var arr2 = row.pixels;
  if (arr1.length != arr2.length) return false;
  for (var i = 0; i < arr1.length; i++) {
    if (!arr1[i].same(arr2[i])) return false;
  }
  return true;
};
Row.prototype.clues = function () {
  var series = this.pixels;
  var clueArr = [];
  var current = 0;
  for (var i = 0; i < series.length; i++) {
    if (series[i].chosen()) {
      current++;
    } else if (current) {
      clueArr.push( new Clue(current) );
      current = 0;
    }
  }
  if (current > 0 || clueArr.length === 0) {
    clueArr.push( new Clue(current) );
  }
  return clueArr;
};

function Puzzle (rawPuzzle) {
  this.rows = rawPuzzle.map(function (rawRow) {
    return new Row(rawRow);
  });
  this.size = rawPuzzle.length;
}
Puzzle.prototype.raw = function () {
  return this.rows.map(function (row) {
    return row.raw();
  });
};
Puzzle.prototype.same = function (puzzle) {
  var arr1 = this.rows;
  var arr2 = puzzle.rows;
  if (arr1.length != arr2.length) return false;
  for (var i = 0; i < arr1.length; i++) {
    if (!arr1[i].same(arr2[i])) return false;
  }
  return true;
};
Puzzle.prototype.rotate = function () {
  var rot = [];
  var rawPuzzle = this.raw();

  for (var i = 0; i < rawPuzzle.length; i++) {
    var row = [];
    for (var j = 0; j < rawPuzzle.length; j++) {
        row.unshift(rawPuzzle[j][i]);
    }
    rot.push(row);
  }
  return new Puzzle(rot);
};

angular.module("gitcross", ['goinstant'])
.config(function (platformProvider) {
  platformProvider.set('https://goinstant.net/JonAbrams/gitcross');
})
.controller("puzzleCtrl", function ($scope, GoAngular) {
  $scope.hi = 'jon';
  var goAngular = new GoAngular($scope, 'puzzleCtrl', { include: ['choices', 'hi', 'youWin'] }).initialize();
  $scope.connecting = true;
  // goinstant.connect('https://goinstant.net/JonAbrams/gitcross', function (err, connection, room) {
    // $scope.$apply(function () {
  goAngular.then(function () {
      $scope.connecting = false;

      // Variables
      $scope.puzzle = new Puzzle(rawPuzzle);
      var rawChoices = [];
      for (var i = 0; i < $scope.puzzle.size; i++) {
        var row = [];
        for (var j = 0 ; j < $scope.puzzle.size; j++) {
          row.push(0);
        }
        rawChoices.push(row);
      }
      $scope.choices = new Puzzle(rawChoices);

      // Functions
      var same = $scope.same = function (arr1, arr2) {
        if (typeof arr1 != 'object') return arr1 == arr2;
        if (arr1 instanceof Clue) return arr1.num == arr2.num;
        if (arr1.length != arr2.length) return false;
        for (var i = 0; i < arr1.length; i++) {
          if (!same(arr1[i], arr2[i])) return false;
        }
        return true;
      };

      // var goChoices = room.key('choices');

      $scope.$watch("choices", function () {
        $scope.youWin = $scope.choices.same($scope.puzzle);
        $scope.rawGrid = $scope.choices.raw();
        // goChoices.set( $scope.choices.raw() );
      }, true);

      // $scope.$watch("rawGrid", function () {

      // });
    });
  // });
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
