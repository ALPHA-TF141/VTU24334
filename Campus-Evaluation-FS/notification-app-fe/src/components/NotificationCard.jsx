import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

export function NotificationCard({
  notification,
  viewed,
  onView,
}) {
  return (
    <Card
      onClick={() => onView(notification.ID)}
      sx={{
        cursor: "pointer",
        borderLeft: viewed
          ? "4px solid #ccc"
          : "4px solid #1976d2",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Chip
            label={notification.Type}
            color={
              notification.Type === "Placement"
                ? "success"
                : notification.Type === "Result"
                ? "warning"
                : "info"
            }
          />

          {!viewed && (
            <Chip
              label="NEW"
              color="primary"
              size="small"
            />
          )}
        </Stack>

        <Typography variant="body1">
          {notification.Message}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {notification.Timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
}