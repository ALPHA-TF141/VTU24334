const PRIORITY_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function getTopNotifications(
  notifications,
  limit = 10
) {
  return [...notifications]
    .sort((a, b) => {
      const weightA =
        PRIORITY_WEIGHT[a.Type] || 0;
      const weightB =
        PRIORITY_WEIGHT[b.Type] || 0;

      if (weightA !== weightB) {
        return weightB - weightA;
      }

      return (
        new Date(b.Timestamp) -
        new Date(a.Timestamp)
      );
    })
    .slice(0, limit);
}