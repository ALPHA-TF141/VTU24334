require("dotenv").config();
const axios = require("axios");
const Log = require("../logging-middleware/logger");

// Weight mapping
const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};


//Calculate priority score

function calculateScore(notification) {
  const weight = TYPE_WEIGHT[notification.Type] || 0;

  // Convert timestamp to milliseconds
  const timestamp = new Date(notification.Timestamp).getTime();

  return {
    ...notification,
    priorityScore: weight * 10000000000000 + timestamp,
  };
}


//Get Top 10 Priority Notifications

async function getTop10Notifications() {
  try {
    await Log(
      "backend",
      "info",
      "service",
      "Fetching notifications from evaluation API"
    );

    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${process.env.TEST_SERVER_TOKEN}`,
        },
      }
    );

    const notifications = response.data.notifications;

    await Log(
      "backend",
      "info",
      "service",
      `Received ${notifications.length} notifications`
    );

    const ranked = notifications
      .map(calculateScore)
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 10);

    await Log(
      "backend",
      "info",
      "service",
      "Top 10 notifications computed successfully"
    );

    console.log("\n===== TOP 10 PRIORITY NOTIFICATIONS =====\n");

    ranked.forEach((n, index) => {
      console.log(
        `${index + 1}. [${n.Type}] ${n.Message} | ${n.Timestamp}`
      );
    });

    return ranked;
  } catch (error) {
    await Log(
      "backend",
      "error",
      "service",
      error.message
    );

    console.error(error.response?.data || error.message);
  }
}

getTop10Notifications();