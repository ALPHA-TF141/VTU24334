require("dotenv").config();
const axios = require("axios");

async function Log(stack, level, packageName, message) {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TEST_SERVER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
  } catch (err) {
    console.log(
      "Logging Error:",
      err.response?.data || err.message
    );
  }
}

module.exports = Log;