import { createContext, useEffect, useState } from "react";

export const SearchHistoryContext = createContext();

const STORAGE_KEY = "searchHistory";
const EXPIRY_KEY = "searchHistoryExpiry";
const EXPIRY_DAYS = 1; // Store for 3 days

export const SearchHistoryProvider = ({children}) => {
    const [searchHistory, setSearchHistory] = useState([]);

    useEffect(() => {
        const storedHistory = localStorage.getItem(STORAGE_KEY);
        const expiryTime = localStorage.getItem(EXPIRY_KEY);

        if(storedHistory && expiryTime){
            const now = new Date().getTime();
            if(now < parseInt(expiryTime, 10)){
                setSearchHistory(JSON.parse(storedHistory));
            }else{
                localStorage.removeItem(STORAGE_KEY); // Remove expired data
                localStorage.removeItem(EXPIRY_KEY);
            }
        }

    }, []);


    const addCity = (city) => {
        setSearchHistory((prev) => {
            const updatedHistory = [city, ...prev.filter((c) => c !== city)];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory.slice(0,3)));
            localStorage.setItem(EXPIRY_KEY, (new Date().getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000).toString());
            return updatedHistory.slice(0,3); // Keep only last 3 cities
       })
    }

    return (
       <SearchHistoryContext.Provider value={{searchHistory, addCity}}>
          {children}
       </SearchHistoryContext.Provider>
    )
}

