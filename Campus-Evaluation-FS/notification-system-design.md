# Notification System Design

# Stage 1 - Rset API Design

## Notification Object

{
    "id" : "uuid",
    "studentId" : 1042,
    "notificationType" : "Placement",
    "message": false,
    "isRead": false,
    "createdAt": "2026-06-17T10:00:00Z"
}

---

## 1. Get Notifications

GET /api/notifications

Headers:
Authorization: Bearer <token>

Query Parameters:
?page=1
?limit=20
?notification_type=Placement

Response:

{
  "notifications": [],
  "total": 150,
  "page": 1,
  "limit": 20
}

---

## 2. Get Single Notification

GET /api/notifications/:id

Response:

{
  "id": "uuid",
  "studentId": 1042,
  "notificationType": "Placement",
  "message": "TCS hiring drive announced",
  "isRead": false,
  "createdAt": "2026-06-17T10:00:00Z"
}

---

## 3. Mark Notification as Read

PATCH /api/notifications/:id/read

Response:

{
  "success": true,
  "message": "Notification marked as read"
}

---

## 4. Mark All Notifications as Read

PATCH /api/notifications/read-all

Response:

{
  "success": true,
  "message": "All notifications marked as read"
}

---

## 5. Create Notification

POST /api/notifications

Request:

{
  "studentIds": [1042,1043],
  "notificationType": "Placement",
  "message": "Infosys hiring drive"
}

Response:

{
  "success": true,
  "notificationId": "uuid"
}

---

## Real-Time Notification Mechanism

WebSocket will be used.

Flow:

1. Student opens application
2. WebSocket connection established
3. New notification pushed instantly
4. UI updated without refresh