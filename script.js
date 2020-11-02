


<!--Ian Flanagan Rollbar 2020 ----->


/*
payload: {

        environment: "production" 
       // environment: "QA",
        /*
        person: {
            id: "123",
            username: "imf",
            email: "test@rollbar.com"
        },
        server: {
            host: "web11",
            root: "http://localhost:8443/DemoJSTest/JSDemo/",
            region: "aws-us-east-2"
        },
        custom: {
            bankTransactionId: "46456456456"
        }
    }-

    */

<!-- add RB snippet here--->

/*
function getMessage(input) {
  
  alert('Hello ' +input);
}

*/

function FirstName() {

  var input = prompt('Enter your First Name');
  getMessage(input);
  
}
        
function LastName() {

  var input = prompt('Enter your Last Name');
  getMessage(input);
  
}


function validateDate() {
  
var myregex =/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/; // && input !=== null
var input = document.getElementById('dob').value;

if(myregex.test(input) && input !=="")
{
     alert('Valid birthdate: ' +input);
     
} else {

  alert('Invalid birthdate: ' +input);
  throw new Error('Invalid birthdate: ' +input)
 
       }
       
}