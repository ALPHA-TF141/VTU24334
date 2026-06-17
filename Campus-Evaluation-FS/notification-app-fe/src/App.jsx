import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from "@mui/material";

import { NotificationsPage } from "./pages/NotificationsPage";

export default function App() {
  const [page, setPage] =
    useState("notifications");

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1 }}
          >
            Campus Notifications
          </Typography>

          <Button
            color="inherit"
            onClick={() =>
              setPage("notifications")
            }
          >
            Notifications
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3 }}>
        <NotificationsPage />
      </Container>
    </>
  );
}