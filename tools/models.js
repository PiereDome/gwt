var mongoose = require('mongoose');

var clientsSchema = mongoose.Schema({
  name: String,
  logo: String,
  contact: {
    name: String,
    info: String
  },
  activeTasks: [tasksSchema],
  completedTasks: [tasksSchema],
  discovery: [discoverySchema],
  primaryConsultant: String,
  onboarding: Boolean,
  startDate: Date,
  replay: Boolean
});

var csvSchema = mongoose.Schema({
  model: String,
  fields: [{
    name: String,
    label: String
  }]
});

var messagesSchema = mongoose.Schema({
  from: String,
  content: String,
  date: Date,
  avatar: String,
  responses: [
    {
      _id:false,
      from: String,
      content: String,
      date: Date,
      avatar: String
    }]
});

var userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  fullName: String,
  userName: String,
  email: String,
  dept: {type: String, enum: ['Replay','PC','Sales','IT Director','Contracts','SC']},
  hash: String,
  salt: String,
  messages: [mongoose.Schema.Types.ObjectId]
});

var passwordResetsSchema = mongoose.Schema({
  key: String,
  userName: String,
  email: String,
  createdAt: { type: Date, expires: 60*60*24 }
});

var tasksSchema = mongoose.Schema({
  title: String,
  icon: String,
  formTemplate: String,
  depts: [String],
  dueDate: Date,
  completed: Date,
  updatedBy: String,
  description: String,
  formData: [{
    label: String,
    model: String,
    dateModel: String,
    optionModel: String,
    notes: String,
    required: Boolean
  }],
  nextTasks: [mongoose.Schema.Types.ObjectId]
});

var discoverySchema = mongoose.Schema({
  internetType: String,
  serverCount: Number,
  computerCount: Number
});

exports.users = mongoose.model('users', userSchema);
exports.passwordResets = mongoose.model('passwordResets', passwordResetsSchema);
exports.tasks = mongoose.model('tasks', tasksSchema);
exports.messages = mongoose.model('messages', messagesSchema);
exports.clients = mongoose.model('clients', clientsSchema);
exports.csv = mongoose.model('csv', csvSchema);