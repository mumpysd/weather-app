import { useState, useContext } from "react";
import { WeatherDataContext } from "../contexts/WeatherDataContext";
import { baseApiUrl, apiKey } from "../constants";

const useWeather = () => {
  const { storeWeatherData } = useContext(WeatherDataContext);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (city, days = 1) => {
    if (!city.trim()) return false; // Prevent empty searches

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${baseApiUrl}/forecast.json?key=${apiKey}&q=${city}&days=${days}&aqi=yes&alerts=yes`
      );
      const geoData = await response.json();

      if (!geoData || !geoData.location) {
        setError("City not found or mismatch!");
        setLoading(false);
        return false;
      }

      const { name, region, country, lat, lon } = geoData.location;

      // Format date
      const formattedDate = geoData.current.last_updated_epoch
        ? new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: geoData.location.tz_id,
          }).format(new Date(geoData.current.last_updated_epoch * 1000))
        : "Date not available"; // Fallback text

      // Get current hour in 24-hour format
      const currentHour = new Date().getHours();

      // Filter next 9 hours of forecast data
      const next9HoursData = geoData.forecast.forecastday[0].hour.filter(
        (hour) => {
          const hourTime = new Date(hour.time).getHours();
          return hourTime >= currentHour && hourTime < currentHour + 9;
        }
      );

      const combinedData = {
        city: name,
        state: region || "N/A",
        country,
        lat,
        lon,
        hoursData: next9HoursData,
        time: formattedDate,
        next7HoursDay: geoData.forecast.forecastday,
        ...geoData, // Merging full weather API response
      };

      // Store in global state if valid
      storeWeatherData(combinedData);
      setLoading(false);
      return true;
    } catch (err) {
      setError("Error fetching weather data!");
      setLoading(false);
      return false;
    }
  };

  return { fetchWeatherData, loading, error };
};

export default useWeather;
