

// add Rollbar Snipet here


/*
function getMessage(input) {
  
  alert('Hello ' +input);
}

*/


function sayHello() {
  var message = getMessage('hello');
  alert(message);
}

function sayGoodbye() {
  var message = getMessage('goodbye');
  alert(message);
}

function FirstName() {

  var input = prompt('Enter your First Name');
  getMessage(input);
  
}
        
function LastName() {

  var input = prompt('Enter your Last Name');
  getMessage(input);
  
}


function validateDate() {
  
var myregex =/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/; // && input !== null
var input = document.getElementById('dob').value;

if(myregex.test(input))
{
     alert('Valid birthdate: ' +input);
     
} else {

  alert('Invalid birthdate: user entered ' +input+ ' use the following format: mm-dd-yyyy');
  throw new Error('Invalid birthdate: ' +input)
 
       }
       
}