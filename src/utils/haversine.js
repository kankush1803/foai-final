/**
 * Calculate the great-circle distance between two points on Earth using the Haversine formula.
 * @returns distance in kilometres
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Calculate speed in km/h between two timestamped positions.
 * Each position: { latitude, longitude, timestamp }
 */
export function calculateSpeed(pos1, pos2) {
  if (!pos1 || !pos2) return 0;
  const dist = haversineDistance(
    pos1.latitude,
    pos1.longitude,
    pos2.latitude,
    pos2.longitude
  );
  const timeDiffHours = (pos2.timestamp - pos1.timestamp) / (1000 * 60 * 60);
  if (timeDiffHours <= 0) return 0;
  return dist / timeDiffHours;
}
