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

# Stage 2 - Database Design

## Suggested Database

PostgreSQL

Reason:

- ACID compliance
- Reliable transactions
- Efficient indexing
- Strong relational support
- Scalability

---

## Students Table

CREATE TABLE students (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

---

## Notifications Table

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  studentId BIGINT,
  notificationType VARCHAR(20),
  message TEXT,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(studentId) REFERENCES students(id)
);

---

## Fetch Notifications

SELECT *
FROM notifications
WHERE studentId = 1042
ORDER BY createdAt DESC;

---

## Unread Notifications

SELECT *
FROM notifications
WHERE studentId = 1042
AND isRead = FALSE;

---

## Mark Read

UPDATE notifications
SET isRead = TRUE
WHERE id = 'uuid';

---

## Scaling Issues

As notifications grow:

- Slow queries
- Large table scans
- Increased storage

Solutions:

- Indexing
- Table partitioning
- Caching
- Read replicas

# Stage 3 - Query Optimization

Current Query:

SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;

---

## Is It Accurate?

Yes.

It returns unread notifications for a student.

---

## Why Is It Slow?

Database Size:

50,000 students
5,000,000 notifications

Without indexes:

- Full table scan
- Sorting millions of rows

Complexity:

O(n)

---

## Better Index

CREATE INDEX idx_notifications_student_read_created
ON notifications(studentId,isRead,createdAt);

Query:

SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = FALSE
ORDER BY createdAt ASC;

Complexity:

Approximately O(log n)

---

## Should We Index Every Column?

No.

Problems:

- Increased storage
- Slower INSERTs
- Slower UPDATEs
- Unused indexes waste memory

Only index frequently searched columns.

---

## Placement Notifications Last 7 Days

SELECT DISTINCT studentId
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';

# Stage 4 - Performance Improvements

Problem:

Every page load triggers database query.

Result:

Database overload.

---

## Solution 1 - Redis Cache

Flow:

User -> Redis -> DB

Benefits:

- Very fast
- Reduced DB load

Tradeoff:

- Cache invalidation complexity

---

## Solution 2 - Pagination

GET /notifications?page=1&limit=20

Benefits:

- Less data transfer

Tradeoff:

- More API calls

---

## Solution 3 - WebSockets

Push notifications in real time.

Benefits:

- No repeated polling

Tradeoff:

- Persistent connections required

---

## Solution 4 - Read Replicas

Benefits:

- Separate reads from writes

Tradeoff:

- Replication lag

Recommended Architecture:

WebSocket
+
Redis Cache
+
PostgreSQL
+
Read Replicas

# Stage 5 - Reliable Bulk Notification System

Current Problems

1. Sequential execution
2. Slow processing
3. Email failures stop workflow
4. Not scalable
5. No retry mechanism

---

## Better Design

Use Message Queue

Examples:

- RabbitMQ
- Kafka

Flow:

HR
|
v
API
|
v
Queue
|
v
Workers
|
+--> Email Service
|
+--> Notification Service
|
+--> Database Service

---

## Why?

- Asynchronous processing
- Retry support
- Fault tolerance
- Scalability

---

## Revised Pseudocode

function notifyAll(studentIds, message){

  for(studentId of studentIds){

    enqueue({
      studentId,
      message
    });

  }

}

worker(){

  task = dequeue();

  saveToDatabase(task);

  sendEmail(task);

  pushNotification(task);

}

---

## Email Failure Case

If email fails:

- Save failure log
- Retry 3 times
- Move to Dead Letter Queue

---

## Should DB Save and Email Happen Together?

No.

Reason:

Email is external.

Database write should succeed independently.

If email fails:

Notification still exists in system.

This improves reliability.

# Stage 6

Priority Ranking:

Placement = 3
Result = 2
Event = 1

Notifications are ranked using:

Priority Score =
(Type Weight × Large Constant)
+ Timestamp

This guarantees:

Placement > Result > Event

while newer notifications of the same type appear first.

Algorithm:

1. Fetch notifications from API
2. Compute score
3. Sort descending
4. Return top 10

Time Complexity:

O(n log n)

Optimization for continuous incoming notifications:

Use a Min Heap of size 10.

For every new notification:

1. Calculate score
2. Compare with heap root
3. Replace root if score is higher

Complexity:

O(n log 10)
≈ O(n)

This allows efficient maintenance of the Top 10 notifications without re-sorting the entire collection.

# Campus Notification Platform - Stage 7

## Overview

This project is a React-based frontend application developed for the AffordMed Campus Hiring Evaluation. The application provides a user-friendly interface for students to view and manage campus notifications related to Placements, Results, and Events.

The frontend consumes the AffordMed Notification API and integrates the custom Logging Middleware developed during the pre-test setup.

---

## Features

### Notifications Page

* View all notifications
* Filter notifications by type

  * All
  * Placement
  * Result
  * Event
* Pagination support
* Viewed / Unviewed notification tracking
* Responsive Material UI design

### Priority Notifications Page

Displays the most important notifications first based on:

| Notification Type | Weight |
| ----------------- | ------ |
| Placement         | 3      |
| Result            | 2      |
| Event             | 1      |

Sorting Criteria:

1. Priority Weight (Descending)
2. Timestamp (Descending)

Supported limits:

* Top 10
* Top 15
* Top 20

---

## Technologies Used

* React
* Vite
* Material UI
* Axios
* JavaScript (ES6)

---

## Project Structure

```text
src/
├── api/
│   └── notifications.js
│
├── components/
│   ├── NotificationCard.jsx
│   └── NotificationFilter.jsx
│
├── hooks/
│   └── useNotifications.js
│
├── pages/
│   ├── NotificationsPage.jsx
│   └── PriorityNotificationsPage.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## API Configuration

### Notification Endpoint

```http
GET /evaluation-service/notifications
```

### Query Parameters

| Parameter         | Description                      |
| ----------------- | -------------------------------- |
| page              | Page number                      |
| limit             | Number of notifications per page |
| notification_type | Placement, Result, Event         |

### Authorization

All API requests include:

```http
Authorization: Bearer <access_token>
```

The token is configured using:

```env
VITE_TOKEN=<ACCESS_TOKEN>
```

---

## Viewed Notifications

Viewed notifications are stored in browser Local Storage.

Storage Key:

```text
viewed
```

When a user clicks a notification:

1. Notification ID is saved in Local Storage.
2. Notification is marked as viewed.
3. UI updates automatically.

---

## Priority Ranking Algorithm

```javascript
const PRIORITY_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};
```

Notifications are sorted by:

```javascript
Weight DESC
Timestamp DESC
```

The top N notifications are then displayed.

---

## Logging Middleware Integration

The frontend integrates the reusable Logging Middleware created during the pre-test setup.

Example log entries:

```javascript
Log(
  "frontend",
  "info",
  "page",
  "Notifications page loaded"
);

Log(
  "frontend",
  "info",
  "api",
  "Fetching notifications"
);

Log(
  "frontend",
  "error",
  "api",
  "Failed to fetch notifications"
);
```

Logging is performed for:

* API calls
* Page navigation
* User actions
* Error handling
* Component lifecycle events

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Running the Application

Start the development server:

```bash
npm run dev
```

Application URL:

```text
http://localhost:3000
```

---

## Build

Generate production build:

```bash
npm run build
```

---

## Testing Checklist

### Notifications Page

* Notifications load successfully
* Filters work correctly
* Pagination works correctly
* Viewed status updates correctly

### Priority Notifications Page

* Notifications sorted by priority
* Top N selection works
* Placement notifications appear before Result and Event notifications

### Error Handling

* Invalid token handled gracefully
* API failures display error messages
* Empty notification list displays informative message

---

## Screenshots

Include screenshots inside:

```text
screenshots/
```

Suggested screenshots:

```text
notifications-page.png
priority-notifications-page.png
mobile-view.png
```

---

## Deliverables

This repository contains:

* Logging Middleware
* Stage 1 System Design
* Stage 2 Database Design
* Stage 3 Query Optimization Analysis
* Stage 4 Performance Improvement Strategy
* Stage 5 Notification Architecture Design
* Stage 6 Priority Notification Implementation
* Stage 7 React Frontend Application
* Screenshots
* Demo Video

---

## Author

Maria Immanuel L

Roll Number: VTU24334
