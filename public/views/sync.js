var url = 'https://goinstant.net/JonAbrams/gitcross';

angular.module('gitcross').factory('goinstant', function () {
  var usersInLobby = {};
  var observers = [];
  var self = {};
  var lobby;

  function fireObservers () {
    observers.forEach(function (observer) {
      observer();
    });
  }

  goinstant.connect(url, function(err, platform, room) {
    if (err) throw err;

    lobby = room;

    lobby.users.get(function (err, users, context) {
      usersInLobby = users;
      lobby.self().get(function (err, value, context) {
        if (err) throw err;
        self.displayName = value.displayName;
        delete usersInLobby[value.id];
        fireObservers();
      });

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
    self: self,
    setName: function (name) {
      if (!self.displayName) return;
      lobby.self().key('displayName').set(name);
    },
    usersInLobby: function () {
      return usersInLobby;
    }
  };
});
