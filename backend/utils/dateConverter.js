const formattedDateString = (date)=>{
    const formattedDate = new Date(date);

    // Format the date using Intl.DateTimeFormat
    const options = {
      weekday: "long", // Day of the week (e.g., "Friday")
      year: "numeric", // Full year (e.g., "2025")
      month: "long", // Full month name (e.g., "January")
      day: "numeric", // Day of the month (e.g., "31")
    };
    const formattedDateString = new Intl.DateTimeFormat("en-GB", options).format(formattedDate);
    return(formattedDateString)
  }
  module.exports = formattedDateString;