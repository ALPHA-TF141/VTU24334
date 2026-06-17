import axios from "axios";

const API_URL =
  "http://4.224.186.213/evaluation-service/notifications";

const TOKEN = import.meta.env.VITE_TOKEN;

export async function fetchNotifications(
  page = 1,
  limit = 20,
  type = "All"
) {
  const params = {
    page,
    limit,
  };

  if (type !== "All") {
    params.notification_type = type;
  }

  const response = await axios.get(API_URL, {
    params,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
}