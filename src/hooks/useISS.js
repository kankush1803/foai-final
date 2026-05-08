import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { calculateSpeed } from '../utils/haversine';

// Proxied through Vite in dev (see vite.config.js)
const ISS_POS_URL = '/api/iss/iss-now.json';
const ASTROS_URL = '/api/iss/astros.json';
const GEOCODE_URL = 'https://nominatim.openstreetmap.org/reverse';

const MAX_POSITIONS = 30; // keep 30 for speed chart, show last 15 on map
const POLL_INTERVAL = 15000;

export function useISS() {
  const [positions, setPositions] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [location, setLocation] = useState('Fetching…');
  const [astronauts, setAstronauts] = useState([]);
  const [astronautCount, setAstronautCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const geocodeTimeout = useRef(null);

  const fetchPosition = useCallback(async () => {
    try {
      const { data } = await axios.get(ISS_POS_URL, { timeout: 10000 });
      if (data.message !== 'success') throw new Error('ISS API error');

      const newPos = {
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
        timestamp: data.timestamp * 1000,
      };

      setPositions((prev) => {
        const updated = [...prev, newPos].slice(-MAX_POSITIONS);

        // Calculate speed from last two positions
        if (updated.length >= 2) {
          const spd = calculateSpeed(
            updated[updated.length - 2],
            updated[updated.length - 1]
          );
          const roundedSpeed = Math.round(spd * 100) / 100;
          setSpeed(roundedSpeed);
          setSpeedHistory((sh) =>
            [
              ...sh,
              {
                speed: roundedSpeed,
                time: new Date(newPos.timestamp).toLocaleTimeString(),
              },
            ].slice(-MAX_POSITIONS)
          );
        }

        return updated;
      });

      // Reverse geocode (debounced to respect Nominatim rate limits)
      if (geocodeTimeout.current) clearTimeout(geocodeTimeout.current);
      geocodeTimeout.current = setTimeout(async () => {
        try {
          const { data: geo } = await axios.get(GEOCODE_URL, {
            params: {
              lat: newPos.latitude,
              lon: newPos.longitude,
              format: 'json',
            },
            headers: { 'User-Agent': 'ISS-Dashboard/1.0' },
          });
          setLocation(
            geo.display_name ||
              geo.address?.country ||
              'Over the ocean'
          );
        } catch {
          setLocation('Over the ocean');
        }
      }, 1500);

      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch ISS position');
      setLoading(false);
    }
  }, []);

  const fetchAstronauts = useCallback(async () => {
    try {
      const { data } = await axios.get(ASTROS_URL, { timeout: 10000 });
      if (data.message !== 'success') throw new Error('Astros API error');
      setAstronauts(data.people || []);
      setAstronautCount(data.number || 0);
    } catch {
      // Non-critical — don't set main error
    }
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPosition();
    fetchAstronauts();
  }, [fetchPosition, fetchAstronauts]);

  useEffect(() => {
    fetchPosition();
    fetchAstronauts();
    const interval = setInterval(fetchPosition, POLL_INTERVAL);
    return () => {
      clearInterval(interval);
      if (geocodeTimeout.current) clearTimeout(geocodeTimeout.current);
    };
  }, [fetchPosition, fetchAstronauts]);

  const currentPos =
    positions.length > 0 ? positions[positions.length - 1] : null;

  return {
    currentPos,
    positions,
    speed,
    speedHistory,
    location,
    astronauts,
    astronautCount,
    loading,
    error,
    refresh,
  };
}
