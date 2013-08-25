var url = require('url');
var qs = require('querystring');
var mongo = require('../tools/mongo-lab');
var hasher = require('../tools/hasher');

var fs = require('fs');
var csv = require('json-csv');
/*
 * GET home page.
 */

exports.csv = function(req, res){
  var collection = req.params.tool;
  var query = req.query || {};
  var options = req.options || {};
  console.log('query: ' + query);
  console.log('options: ' + options);
  mongo.find(collection, query, options, function(err, docs){
    csv.toCSV({
      data: docs,
      fields: [{
        name: 'firstName',
        label: 'First Name'
      },
      {
        name: 'lastName',
        label: 'Last Name'
      }]
    }, 
    function(err, csv){
      // console.log(csv);
      res.attachment('tmp.csv');
      res.end(csv);
    });
    return 'blah';
  });
};

exports.index = function(req, res){
  res.render('index');
};

exports.login = function(req, res){
  res.render('login');
};

exports.logout = function(req, res){
  req.session.destroy();
  res.redirect('/login');
};

exports.recover = function(req, res){
  res.render('recover');
};

exports.sendRecoveryEmail = function(req, res){
  
};

exports.partials = function (req, res) {
  var reqPath = url.parse(req.url).path.substr(1);
  res.render(reqPath);
};

exports.taskPartials = function(req, res){
  var id = req.params.taskId;
  mongo.findById('tasks', id, function(err, doc){
    res.render('partials/tasks/basicTask',doc);
  });
};

exports.authenticate = function(req, res, next){
  if(req.session.username){
    next();
  }
  else if(req.body){
    if(req.body.username && req.body.password){
      console.log(req.body.username);
      mongo.find('users', {userName: req.body.username}, function(err, docs){
        // if(err) return console.log(err);
        if(docs.length === 1){
          var user = docs[0];
          if(user.salt && user.hash){
            hasher.generate(req.body.password, user.salt, function(err, hash){
              if(hash === user.hash){
                req.session.username = user.userName;
                res.redirect('/dashboard');
              }
              else{
                // Incorrect Password
                console.log('incorrect password');
                res.redirect('/login');
              }
            });
          }
        }
        else {
          // User does not exist
          console.log('doesn\'t exist');
          res.render('login');
        }
      });
    }
    else{
      // Username or Password is missing from req
      res.redirect('/login');
    }
  }
  else{
    res.render('login');
  }
};

exports.getUser = function(req, res){
  var username = req.session.username;
  mongo.find('users', {userName: username}, {hash: 0, salt: 0}, function(err, docs){
    if(err) return console.log(err);
    res.send(docs[0]);
  });
};

exports.getApi = function(req, res){
  var collection = req.params.tool;
  var id = req.params.id;
  if(id){
    mongo.findById(collection, id, function(err, doc){
      if(err) return console.log(err);
      res.send(doc);
    });
  } 
  else if(req.query){
    var query = req.query;
    console.log(query);
    var fields = {hash: 0, salt: 0};
    if(query['0']){
      var ids = [];
      for(var x in query){
        ids.push(query[x]);
      }
      mongo.findByIds(collection, ids, function(err, docs){
        res.send(docs);
      });
    }
    else{
      mongo.find(collection, query, fields, function(err, docs){
        if(err) return console.log(err);
        if(docs.length > 1){
          res.send(docs);
        } else{
          res.send(docs[0]);
        }
      });
    }
  }
  else {
    res.send('No query parameters specified');
  }
};
exports.postApi = function(req, res){
  var collection = req.params.tool;
  var id = req.params.id;
  if(id){
    mongo.insertById(collection, id, req.body, function(err, docs){
      if(err) return console.log(err);
      res.send(docs);
    });
  }
  else{
    mongo.insert(collection, req.body, function(err, docs){
      if(err) return console.log(err);
      res.send(docs);
    });
    console.log('post');
    console.log(req.body);
    console.log(req.query);
  }
};
exports.putApi = function(req, res){
  var collection = req.params.tool;
  console.log('put');
  console.log(req.body);
  mongo.updateById(collection, req.body._id, req.body, function(err, docs){
    if(err) return console.log(err);
    res.send(docs);
  });
};
exports.deleteApi = function(req, res){
  var collection = req.params.tool;
  var id = req.params.id;
  if(id){
    mongo.removeById(collection, id, function(err, docs){
      if(err) return console.log(err);
      res.send(docs);
    });
  }
  // mongo.remove(collection, req.query, function(err){
  //   if(err) return console.log(err);
  //   res.send(true);
  // });
};