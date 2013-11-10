var url = 'https://goinstant.net/JonAbrams/gitcross';

angular.module('gitcross').factory('goinstant', function () {
  var usersInLobby = {};
  var observers = [];
  var self = {};
  var lobby;
  var trophies;

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
      lobby.self().get(function (err, user, context) {
        if (err) throw err;
        self.displayName = user.displayName;
        delete usersInLobby[user.id];
        trophies = [];
        for (var key in user.trophies) {
          trophies.push(user.trophies[key]);
        }
        fireObservers();
      });

      lobby.users.watch(function(value, context) {
        if (context.key.match(/displayName$/) && usersInLobby[context.userId]) {
          usersInLobby[context.userId].displayName = value;
        }

        if (context.key.match(/\/trophies\//) && usersInLobby[context.userId]) {
          console.log("New trophy for " + usersInLobby[context.userId].displayName);
          usersInLobby[context.userId].trophies[value.username] = value;
        }
      });

      lobby.on('join', function (user) {
        console.log("User joined lobby!", user);
        usersInLobby[user.id] = user;
      });

      lobby.on('leave', function (user) {
        console.log("User left lobby!", user);
        delete usersInLobby[user.id];
      });
    });
  });

  return {
    registerObserver: function (callback) {
      observers.push(callback);
    },
    self: self,
    trophies: function () {
      return trophies;
    },
    setName: function (name) {
      if (!self.displayName) return;
      lobby.self().key('displayName').set(name);
    },
    addTrophy: function (trophy) {
      lobby.self().key('trophies').key(trophy.username).set(trophy);
    },
    usersInLobby: function () {
      return usersInLobby;
    }
  };
});
