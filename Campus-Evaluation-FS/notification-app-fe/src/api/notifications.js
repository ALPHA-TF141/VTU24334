import axios from "axios";

const API_URL =
  "http://4.224.186.213/evaluation-service/notifications";

const TOKEN = import.meta.env.VITE_TOKEN;

console.log("TOKEN:", TOKEN);

export async function fetchNotifications(
  page = 1,
  limit = 10,
  type = "All"
) {
  try {
    const params = {
      page,
      limit,
    };

    if (type && type !== "All") {
      params.notification_type = type;
    }

    const response = await axios.get(API_URL, {
      params,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log("API SUCCESS:", response.data);

    return response.data;
  } catch (error) {
  console.log("STATUS:", error.response?.status);

  console.log(
    "DATA:",
    JSON.stringify(error.response?.data, null, 2)
  );

  console.log(
    "FULL ERROR:",
    error.response
  );

  return {
    notifications: [],
  };
}
}