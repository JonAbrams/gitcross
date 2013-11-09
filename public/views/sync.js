var url = 'https://goinstant.net/JonAbrams/gitcross';

angular.module('gitcross').factory('goinstant', function () {
  var usersInLobby = {};
  var observers = [];

  function fireObservers () {
    observers.forEach(function (observer) {
      observer();
    });
  }

  goinstant.connect(url, function(err, platform, lobby) {
    if (err) {
      throw err;
    }

    lobby.users.get(function (err, users, context) {
      usersInLobby = users;
      console.log(usersInLobby);
      fireObservers();

      lobby.on('join', function (user) {
        console.log("User joined lobby!", user);
        usersInLobby[user.id] = user;
        fireObservers();
      });

      lobby.on('leave', function (user) {
        console.log("User left lobby!", user);
        delete usersInLobby[user.id];
        fireObservers();
      });
    });
  });

  return {
    registerObserver: function (callback) {
      observers.push(callback);
    },
    usersInLobby: function () {
      return usersInLobby;
    }
  };
});
