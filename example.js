'use strict';

var request = new XMLHttpRequest();
request.open('GET', 'https://www.codewars.com/api/v1/users/MrAutoIt', true);

var status = request.status;

console.log('Status Code is: ' +status);

request.onload = function() {

  if (this.status >= 200 && this.status < 400) {

    var resp = this.response; 
    console.log(`Response is:  ${resp}`);
  } else {
     console.log('Error can\'t connect to API');

  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send();

// create a date 4 ways 


let family = ['Ian','Nichole','Royal','Roarke','Hailey'];

let arraylength = family.length;

let lastItem = family[family.length - 1];
console.log(family[lastItem]);

// family.forEach(element => console.log(element));



