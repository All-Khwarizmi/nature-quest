import { useCallback, useEffect, useState } from "react";

interface LocationAndSeason {
  location: string;
  season: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}
export function useSeasonAndLocation() {
  const [locationData, setLocationData] = useState<LocationAndSeason | null>(null);

  const getLocationAndSeason = useCallback(async (): Promise<LocationAndSeason | null> => {
    try {
      // Check if we already have permission
      const permissionStatus = await navigator.permissions.query({ name: "geolocation" });

      // If permission is denied, return early
      if (permissionStatus.state === "denied") {
        console.log("Location permission is denied");
        return null;
      }

      // If permission is already granted or hasn't been asked yet
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false, // Set to false for faster response
          timeout: 5000,
          maximumAge: 300000, // Cache for 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;

      // Get season based on month and hemisphere
      const currentMonth = new Date().getMonth();
      const season = getSeason(latitude, currentMonth);

      // Only try to get location name if we have coordinates
      let location = "Unknown Location";
      try {
        const locationName = await getLocationName(latitude, longitude);
        if (locationName) {
          location = locationName;
        }
      } catch (error) {
        console.warn("Could not get location name, using coordinates only");
      }

      return {
        location,
        season,
        coordinates: { latitude, longitude },
      };
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  }, []);
  useEffect(() => {
    // Only ask for location if we haven't already
    if (!locationData) {
      getLocationAndSeason().then(result => {
        if (result) {
          setLocationData(result);
        }
      });
    }
  }, [getLocationAndSeason, locationData]);

  console.log(locationData);

  function getSeason(latitude: number, month: number): string {
    const isNorthernHemisphere = latitude > 0;

    // Meteorological seasons
    if (isNorthernHemisphere) {
      if (month >= 2 && month <= 4) return "spring";
      if (month >= 5 && month <= 7) return "summer";
      if (month >= 8 && month <= 10) return "autumn";
      return "winter";
    } else {
      if (month >= 2 && month <= 4) return "autumn";
      if (month >= 5 && month <= 7) return "winter";
      if (month >= 8 && month <= 10) return "spring";
      return "summer";
    }
  }

  async function getLocationName(latitude: number, longitude: number): Promise<string | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            "Accept-Language": "en", // Get English names
            "User-Agent": "NatureQuest_App", // Identify our app to the service
          },
        },
      );

      if (!response.ok) throw new Error("Location service unavailable");

      const data = await response.json();

      // Try to get the most specific location name available
      return (
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        data.address?.state ||
        null
      );
    } catch (error) {
      console.warn("Error getting location name:", error);
      return null;
    }
  }
  return {
    locationData,
  };
}

export default useSeasonAndLocation;
