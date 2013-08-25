'use strict';

/* Filters */

angular.module('myApp.filters', [])
  .filter('interpolate', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  })
  .filter('dept', function(profile){
    var dept = profile.getUser().dept;
    return function(tasks, bool){
      if(tasks){
        var index = tasks.indexOf(dept);
        if(index === -1 && bool){
          return false;
        }
        else if(index === -1 && !bool){
          return tasks.join(', ');
        }
        else if(bool){
          return tasks[index];
        }
        else if(!bool){
          var newArr = tasks.slice(0,index);
          newArr = newArr.concat(tasks.slice(index+1));
          return newArr.length > 0 ? newArr.join(', '): '';
        }
      }
      else{
        return dept;
      }
    };
  })
  .filter('contact', function(){
    return function(text){
      var phoneRegex = /^[+]?1?[\-(]?\d{3}[)\-]?\d{3}[\-]?\d{4}$/;
      var emailRegex = /^\s*[\w\-\+_]+[\.[\w\-\+_]+]*\@[\w\-\+_]+\.[\w\-\+_]+[\.[\w\-\+_]+]*\s*$/;
      if(text){
        var phoneMatch = text.match(phoneRegex) || [];
        var emailMatch = text.match(emailRegex) || [];
        if(phoneMatch[0]){
          if(text.replace(/[\-()]/g,'').split('').length > 11){
            return '';
          }
          var match = phoneMatch[0];
          var raw = match.replace(/[\-()]/g,'').split('');
          if(raw.length == 10){
            raw.splice(0,0,'(');
            raw.splice(4,0,') ');
            raw.splice(8,0,'-');
          }
          if(raw.length == 11){
            raw.splice(1,0,'(');
            raw.splice(5,0,') ');
            raw.splice(9,0,'-');
          }
          raw.splice(0,0,'Phone: ');
          return raw.join('');
        }
        else if(emailMatch[0]){
          var match = emailMatch[0];
          return 'Email: ' + match;
        }
        else{
          return '';
        }
      }
    };
  })
  .filter('timeago', function(){
    return function(time, local, raw){
      if(!time) return 'never';
      
      if(!local){
        (local = Date.now());
      }
      
      if(angular.isDate(time)){
        time = time.getTime();
      } else if(typeof time === 'string'){
        time = new Date(time).getTime();
      }
      
      if(angular.isDate(local)){
        local = local.getTime();
      } else if(typeof local === 'string'){
        local = new Date(local).getTime();
      }
      
      if(typeof time !== 'number' || typeof local !== 'number'){
        return;
      }
      
      var offset = Math.abs((local-time)/1000),
        span = [],
        MINUTE = 60,
        HOUR = 3600,
        DAY = 86400,
        WEEK = 604800,
        MONTH = 2629744,
        YEAR = 31556926,
        DECADE = 315569260;
        
      if(offset <= MINUTE) span = ['', raw? ' now': ' less than a minute'];
      else if(offset < (HOUR)) span =[Math.round(Math.abs(offset/MINUTE)), ' min'];
      else if(offset < (DAY)) span = [Math.round(Math.abs(offset/HOUR)), ' hour'];
      else if(offset < (WEEK)) span =[Math.round(Math.abs(offset/DAY)), ' day'];
      else if(offset < (MONTH)) span = [Math.round(Math.abs(offset/WEEK)), ' week'];
      else if(offset < (YEAR)) span = [Math.round(Math.abs(offset/MONTH)), ' month'];
      else if(offset < (DECADE)) span = [Math.round(Math.abs(offset/YEAR)), ' year'];
      
      span[1] += (span[0] === 0 || span[0] > 1)?'s':'';
      span = span.join('');
      
      if(raw === true){
        return span;
      }
      return(time<=local)?span + ' ago':'in ' + span;
      
    };
  });
