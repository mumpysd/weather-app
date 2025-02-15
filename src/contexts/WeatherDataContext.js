import React, { createContext, useState } from "react";

export const WeatherDataContext = createContext();

const STORAGE_KEY = "weatherData";
const EXPIRY_KEY = "weatherDataExpiry";
const EXPIRY_DAYS = 1; // Store for 1 days

export const WeatherDataProvider = ({children}) => {
    const [weatherData, setWeatherData] = useState([]);

    const storeWeatherData = (data) => {
        const weatherData = data;
       // localStorage.setItem(STORAGE_KEY, JSON.stringify(weatherData));
       // localStorage.setItem(EXPIRY_KEY, (new Date().getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000).toString());
        setWeatherData(weatherData);
        return weatherData; // Keep only last 3 cities
    }

    return (
        <WeatherDataContext.Provider value={{weatherData, storeWeatherData}}>
            {children}
        </WeatherDataContext.Provider>
    )
}