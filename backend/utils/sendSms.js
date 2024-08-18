const http = require("http");
const querystring = require("querystring");

const sendSMS = async (options) => {
  const postData = querystring.stringify({
    token: process.env.SMS_TOKEN,
    to: options.number,
    message: options.message,
    json: "1", // Include this to specify JSON response
  });

  const requestOptions = {
    hostname: "api.greenweb.com.bd",
    path: "/api.php?json", // Modify the path to include JSON
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(requestOptions, (res) => {
      let responseData = "";

      res.setEncoding("utf8");

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
};

module.exports = sendSMS;

//   const date = classInfo.date.toISOString().split("T")[0];
//   await sendSMS({
//     number: updatedStudent.whatsappNumber,
//     message: `Dear ${updatedStudent.name},\nYour next class will be held ${date} from ${classInfo.startingTime} -  ${classInfo.finishingTime}. From ScienceTent ${updatedStudent.map}`,
//   });
