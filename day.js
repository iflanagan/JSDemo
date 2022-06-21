var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

console.log(`month: ${month} day ${day} `);

const date = new Date();
const currentYear = date.getFullYear();
const currentMonth = date.getMonth() + 1; // 👈️ months are 0-based
  
  // 👇️ Current Month
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  console.log(daysInCurrentMonth);

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  if ((day === daysInCurrentMonth) && ( month === 12)) {

    console.log('Time to pick Jan 1 of the next year');
    day = 1;
    

  } elseif (day === daysInCurrentMonth) {
      console.log('Time to pick the next day in the next month');
      
  }


