import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

const PRIORITY_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function PriorityNotificationsPage({
  notifications = [],
}) {
  const [limit, setLimit] = useState(10);

  const sortedNotifications = [...notifications]
    .sort((a, b) => {
      const weightA =
        PRIORITY_WEIGHT[a.Type] || 0;

      const weightB =
        PRIORITY_WEIGHT[b.Type] || 0;

      if (weightA !== weightB) {
        return weightB - weightA;
      }

      return (
        new Date(b.Timestamp).getTime() -
        new Date(a.Timestamp).getTime()
      );
    })
    .slice(0, limit);

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        px: 2,
        py: 4,
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
      >
        Priority Notifications
      </Typography>

      <Box mb={3}>
        <Typography mb={1}>
          Top Notifications
        </Typography>

        <Select
          value={limit}
          onChange={(e) =>
            setLimit(Number(e.target.value))
          }
          size="small"
        >
          <MenuItem value={10}>
            Top 10
          </MenuItem>
          <MenuItem value={15}>
            Top 15
          </MenuItem>
          <MenuItem value={20}>
            Top 20
          </MenuItem>
        </Select>
      </Box>

      <Stack spacing={2}>
        {sortedNotifications.length === 0 ? (
          <Typography>
            No notifications available
          </Typography>
        ) : (
          sortedNotifications.map(
            (notification) => (
              <Card
                key={notification.ID}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Chip
                      label={
                        notification.Type
                      }
                      color={
                        notification.Type ===
                        "Placement"
                          ? "success"
                          : notification.Type ===
                            "Result"
                          ? "warning"
                          : "info"
                      }
                    />

                    <Typography
                      variant="caption"
                    >
                      {
                        notification.Timestamp
                      }
                    </Typography>
                  </Stack>

                  <Typography>
                    {
                      notification.Message
                    }
                  </Typography>
                </CardContent>
              </Card>
            )
          )
        )}
      </Stack>
    </Box>
  );
}