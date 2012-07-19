(function () {

  // XXX note, only one test can do login/logout things at once! for
  // now, that is this test.

  var username = Meteor.uuid();
  var email = Meteor.uuid() + '@example.com';
  var password = 'password';

  var logoutStep = function (test, expect) {
    Meteor.logout(expect(function (error) {
      test.equal(error, undefined);
      test.equal(Meteor.user(), null);
    }));
  };

  testAsyncMulti("passwords - create user and login via username and email", [
    function (test, expect) {
      // XXX argh quiescence + tests === wtf. and i have no idea why
      // this was necessary here and not in other places. probably
      // because it's dependant on how long method call chains are in
      // other tests
      var quiesceCallback = expect(function () {
        test.equal(Meteor.user().username, username);
      });
      Meteor.loginNewUser(username, email, password, expect(function (error) {
        test.equal(error, undefined);
        Meteor.default_connection.onQuiesce(quiesceCallback);
      }));
    },
    logoutStep,
    function (test, expect) {
      Meteor.loginWithPassword(username, password, expect(function (error) {
        test.equal(error, undefined);
        test.equal(Meteor.user().username, username);
      }));
    },
    logoutStep,
    function (test, expect) {
      Meteor.loginWithPassword({username: username}, password, expect(function (error) {
        test.equal(error, undefined);
        test.equal(Meteor.user().username, username);
      }));
    },
    logoutStep,
    function (test, expect) {
      Meteor.loginWithPassword(email, password, expect(function (error) {
        test.equal(error, undefined);
        test.equal(Meteor.user().username, username);
      }));
    },
    logoutStep,
    function (test, expect) {
      Meteor.loginWithPassword({email: email}, password, expect(function (error) {
        test.equal(error, undefined);
        test.equal(Meteor.user().username, username);
      }));
    },
    logoutStep
  ]);

}) ();