var mongoose = require('mongoose');
var Model = require('./models.js');

function initializeDb(){
  console.log('Connecting to database...');
  mongoose.connection.on('open', function(){
    console.log('Connected to the database');
  });
  mongoose.connect('mongodb://tools:D*d20mkpi!@ds037498.mongolab.com:37498/worktools');
}

initializeDb();

// GET
exports.find = function(collectionId, query, fields, callback){
  if(typeof fields === 'function'){
    callback = fields;
    fields = {};
  }
  // Returns [err, docs]
  Model[collectionId].find(query, fields, callback);
};

exports.findById = function(collectionId, id, callback){
  Model[collectionId].findById(id, callback);
};

exports.findByIds = function(collectionId, ids, callback){
  Model[collectionId].find({'_id': { $in: ids}}, callback);
};

// POST
exports.insert = function(collectionId, data, callback){
  Model[collectionId].create(data, callback);
};
exports.insertById = function(collectionId, id, data, callback){
  if(data._id){
    delete data._id;
  }
  Model[collectionId].findByIdAndUpdate(id, data, {upsert: true}, callback);
  // var doc = new Model[collectionId](data);
  // doc.save(callback);
};

// PUT
exports.update = function(collectionId, query, update, callback){
  Model[collectionId].update(query, update, callback);
};

exports.updateById = function(collectionId, id, data, callback){
  if(data._id){
    delete data._id;
  }
  Model[collectionId].findByIdAndUpdate(id, data, {upsert: false}, callback);
};

// DELETE
exports.remove = function(collectionId, query, callback){
  Model[collectionId].remove(query, callback);
};

exports.removeById = function(collectionId, id, callback){
  Model[collectionId].findByIdAndRemove(id, callback);
};