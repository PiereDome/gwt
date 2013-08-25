var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: 'greystoneworktools@gmail.com',
    pass: 'Password1234!@#$'
  }
});

var emailSignature = '\n\nGreystone Work Tools\nSupport: bpedersen@greystonetech.com\n\n________________________________________'

exports.sendEmail = function(origEmail, responseText, callback){
  
  for(x in origEmail.headers){
    // console.log(x);
  }
  
  var mailOptions = {
    from: 'Greystone Work Tools <greystoneworktools@gmail.com>',
    to: origEmail.from[0].address,
    subject: 'RE: ' + origEmail.subject,
    text: responseText + emailSignature + 
          '\nFrom: ' + origEmail.from[0].name + ' <' + origEmail.from[0].address + '>' + 
          '\nSent: ' + origEmail.headers.date +
          '\nTo: ' + origEmail.headers.recipient +
          '\nSubject: ' + origEmail.subject + 
          '\n' + origEmail.text
  };
  
  smtpTransport.sendMail(mailOptions, callback);
};

exports.sendError = function(origEmail, type, callback){
  var errorMessage = '';
  if(type === 'BLANK SUBJECT'){
    errorMessage = 'The email you sent had a blank subject line. Please try again. ';
  }
  else if(type === 'WRONG DOMAIN'){
    errorMessage = 'You are not authorized to use this system!';
  }
  var mailOptions = {
    from: 'Greystone Work Tools <greystoneworktools@gmail.com>',
    to: origEmail.from[0].address,
    subject: 'RE: ',
    text: 'ERROR: ' + errorMessage + emailSignature + 
          '\nFrom: ' + origEmail.from[0].name + ' <' + origEmail.from[0].address + '>' + 
          '\nSent: ' + origEmail.headers.date +
          '\nTo: ' + origEmail.headers.recipient +
          '\nSubject: ' + origEmail.subject + 
          '\n' + origEmail.text
  };
  
  smtpTransport.sendMail(mailOptions, callback);
};