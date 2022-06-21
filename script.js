

// add Rollbar Snipet here

function myPopup() {
  window.open("http://www.google.com", "myWindow", "status=1, height=300, width=300, resizable=0")
}

function OpenTab() {

  let myURl = location.href;
  let myPort = myURl.slice(17,21);
  window.open(`http://localhost:${myPort}/JSDemoApp/JSDemo/index.html`, '_blank');
}

// use to randomize transID in custom field 
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function saveStaticDataToFile() {
  var blob = new Blob(["Testim Demo Example, Ian Test."],
    { type: "text/plain;charset=utf-8" });
  saveAs(blob, "test.txt");
}

function ianexample() {

  const mobiles = [
    {
        brand: 'Samsung',
        model: 'Galaxy Note 9'
    },
    {
        brand: 'Google',
        model: 'Pixel 3'
    },
    {
        brand: 'Apple',
        model: 'iPhone X'
    }
];


mobiles.forEach(mobile => {
  for (let key in mobile) {
      console.log(`${key}: ${mobile[key]}`);
  }
});

}

function GenerateRandomNumber() {

  let array = [0,1,2,3,4,5,6,7,8,9];
  let sub;

  if  (array.length === 0) {
    throw new Error('Array is empty');
  }
  let randomValue = (Math.floor((Math.random() * array.length) +1));
  if (randomValue >=5 ) {
    alert('Random Value is ' +randomValue);
    console.log('Random Value is ' +randomValue);
  }
  
  return randomValue;
}


function download() {

  axios({
    url: 'https://source.unsplash.com/random/500x500',
    method: 'GET',
    responseType: 'blob'
  })
    .then((response) => {
      const url = window.URL
        .createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'image.jpg');
      document.body.appendChild(link);
      link.click();
    })
}

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

function basicPopup(url) {
  popupWindow = window.open(url, 'popUpWindow', 'height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
}

function validateDate() {

  var myregex = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/; // && input !== null
  var input = document.getElementById('dob').value;

  if (myregex.test(input)) {
    alert('Valid birthdate: ' + input);
    console.log('Valid birthdate: ' + input);

  } else {

    alert('Invalid birthdate: user entered ' + input + ' use the following format: mm-dd-yyyy');
    console.log('Invalid birthdate: user entered ' + input + ' use the following format: mm-dd-yyyy');
    throw new Error('Invalid birthdate please enter a valid birthdate mm-dd-yyyy: ' + input);

  }

}

function confirm_alert(node) {
  return confirm("You Clicked on the Name Shasta Flanagan!!!!");
}


function confirm_alert_RF(node) {
  return confirm("You Clicked on the Name Royal Flanagan!!!!");
}

function tableText() {
  alert(this.innerHTML);
}

var cells = document.querySelectorAll("td")

for (var i = 0; i < cells.length; i++){
  cells[i].addEventListener("click", tableText)
}

function createCookie() {

  var cookieBtn = document.getElementById("cookie");

  cookieBtn.addEventListener('click', function () {

    var currentTime = new Date();
    document.cookie = "username=IanFlanagan";
    let myCookie = document.cookie;
    console.log('Cookie Created ' + myCookie);

  });

}

function clickButton() {

  let clickmeBtn = document.getElementById('clickMe');
  clickmeBtn.addEventListener('click', function () {

    alert('effin doyale effin did you punk!!!!');
    console.log('royal clicked the button!!!!');

  });
}

function promiseFail() {

  var promiseBtn = document.getElementById('promise');
  console.log(promiseBtn);

  promiseBtn.addEventListener('click', function () {

    getCountryData('portugal');
  });
}

const getCountryData = function (country) {

  fetch('https://restcountries.eu/rest/v2/name/${country}')
    .then(function (response) {

      console.log(response);
      return response.json();

    })
    .then(function (data) {
      console.log(data);


    });

};