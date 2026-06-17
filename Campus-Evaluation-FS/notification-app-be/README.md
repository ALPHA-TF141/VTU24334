## Notification App Backend

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