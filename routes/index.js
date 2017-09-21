'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
//IMPORTING CLIENT
var client = require('../db');

module.exports = function makeRouterWithSockets (io) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
    client.query('SELECT * FROM tweets, users WHERE users.id = tweets.user_id', function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });

    });
  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', function(req, res, next){
    client.query('SELECT * FROM tweets, users WHERE users.name = $1', [req.params.username],function(err, result){
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true});
    })
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    client.query('SELECT * FROM tweets, users WHERE tweets.user_id = $1 AND tweets.user_id = users.id', [req.params.id], function(err, result){
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      console.log(tweets)
      res.render('index', {title: 'Twitter.js', tweets: tweets});
    });
  });

  // create a new tweet
router.post('/tweets', function(req, res, next){
  client.query('INSERT INTO users (name) VALUES ($1)', [req.body.name], function(err, result){
    if (err) return next(err); // pass errors to Express
    client.query('INSERT INTO tweets (content) VALUES ($1)', [req.body.content], function(err, result){
      if (err) return next(err); // pass errors to Express
        var tweets = result.rows;
          // res.render('index', {title: 'Twitter.js', tweets: tweets});
        io.sockets.emit('new_tweet', tweets);
        res.redirect('/');
      });
    })
});

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });




  return router;
}
