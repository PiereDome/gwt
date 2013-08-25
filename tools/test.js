var mongo = require('./mongo-lab.js');

mongo.find('clients', {name:'Misfits'}, function(err, docs){
  console.log(docs);
});