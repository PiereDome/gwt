var fs = require("fs"),
  Imap = require('imap'),
  MailParser = require('mailparser').MailParser,
  emailer = require('./email-smtp'),
  mongo = require('./mongo-lab.js');
  

var imap = new Imap({
  user: 'greystoneworktools@gmail.com',
  password: 'Password1234!@#$',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: {rejectUnauthorized: false }
});

function openInbox(callback){
  imap.openBox('INBOX', false, callback);
}

function processMessage(email){
  var greystoneEmailRegex = /^(\s*[\w\-\+_]+[\.[\w\-\+_]+]*\@greystonetech.com)$/;
  var emailAddress = email.from[0].address.match(greystoneEmailRegex);
  
  // VERIFY IT'S A GREYSTONETECH EMAIL ADDRESS 
  if(emailAddress){
    if(email.subject){
      var query = {'name': {'$regex': email.subject, $options: 'i'}};
      mongo.find('clients', query, {'_id': 0, 'name': 1, 'contact': 1}, function(err, docs){
        if(docs.length === 0){
          var subject = email.subject.split('').join('[\\w\\s]*');
          query = {'name': {'$regex': subject, $options: 'i'}};
          mongo.find('clients', query, {'_id': 0, 'name': 1, 'contact': 1}, function(err, docs){
            emailer.sendEmail(email, docs, function(err, res){
              if(err) return console.log(err);
            });
          });
        }
        else {
          emailer.sendEmail(email, docs, function(err, res){
            if(err) return console.log(err);
            console.log('Searched MongoDB');
          });
        }
      });
      // if(email.subject.toLowerCase() == 'client'){
      //   emailer.sendEmail(email, email.text, 'This is Client Info',  function(err, res){
      //     if(err) return console.log(err);
      //     console.log('Sent Client Data');
      //   });
      // }
      // else {
      //   if(email.attachments){
      //     // PROCESS ATTACHMENTS
      //     for(var i = 0; i<email.attachments.length; i++){
      //       var output = fs.createWriteStream(email.attachments[i].generatedFileName);
      //       email.attachments[i].stream.pipe(output);
      //     }
      //   }
      //   emailer.sendEmail(email, email.text, function(err, res){
      //     if(err) return console.log(err);
      //     console.log('Sent to non-client email');
      //   });
      // }
    }
    // RESPOND TO NO SUBJECT LINE
    else {
      emailer.sendError(email, 'BLANK SUBJECT', function(err, res){
        console.log('Responded to blank subject line');
      });
    }
  }
  // RESPOND TO NON-GREYSTONETECH EMAIL
  else {
    emailer.sendError(email, 'WRONG DOMAIN', function(err, res){
      console.log('Message sent to non-greystone email');
    });
  }
}

imap.once('ready', function(){
  var checkMessages = function(){
    imap.openBox('INBOX', false, function(err, box){
      if(err) throw err;
      var f = imap.seq.fetch('1:*', {
        bodies: ''
      });
      f.on('message', function(msg, seqno){
        msg.on('body', function(stream, info){
          var mailparser = new MailParser({streamAttachments: true});
          stream.pipe(mailparser);
          
          mailparser.on('end', function(data){
            processMessage(data);
          });
        });
        msg.once('attributes', function(attrs){
          // DELETING THE EMAIL FROM THE INBOX
          imap.addFlags(attrs.uid, 'Deleted', function(err){
            if(err) return console.log(err);
            imap.expunge(function(err){
              if(err) return console.log(err);
              console.log('deleted');
            });
          });
        });
        
        msg.once('end', function(){
          // console.log(prefix + 'Finished');
        });
      });
      f.once('error', function(err){
        console.log('Fetch error: ' + err);
      });
      f.once('end', function(){
        console.log('Done fetching all messages!');
      });
    });
  };
  var checkTimer = setInterval(checkMessages, '3000');
});

imap.once('error', function(err){
  console.log(err);
});

imap.once('end', function(){
  console.log('Connection ended');
});

imap.connect();