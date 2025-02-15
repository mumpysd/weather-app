import { Box, Typography } from "@mui/material";
import styled from "@emotion/styled/macro";
import { SearchHistoryContext, SearchHistoryProvider } from "../../contexts/SearchHistoryContext";
import { useContext } from "react";
import { WeatherDataContext, WeatherDataProvider } from "../../contexts/WeatherDataContext";
import { baseApiUrl, apiKey } from "../../constants";

const BodyWrapper = styled(Box) ({
    padding: "10px",
    color: "#000",
    margin: "20px"
});

const TopNavBar = styled(Box) ({
    display: "flex",
    flexWrap: "wrap"
})

const TopNavBarItem = styled('div') ({
    background: "#0a0a23",
    width: "auto",
    height: "30px",
    color: "#fff",
    fontSize: "12px",
    marginRight: "0px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2px 10px",
    border: "1px solid #fff",
    borderRadius: "2px 10px 0px 0px",
    fontWeight: "bold",
    textTransform: "capitalize",
    cursor: "pointer"
})

const MainContainer = styled('div')({
    position: "relative",
    background: "#f1f2f2",
    minHeight: "40vh"
})

const emptyStyles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "70vh", // Full screen height
      textAlign: "center",
    },
    text: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#333",
    },
  };

const Body = () => {
    const {searchHistory} = useContext(SearchHistoryContext);
    const {weatherData, storeWeatherData} = useContext(WeatherDataContext);

    console.log(weatherData);

     const fetchWeatherData = async (city) => {
            if(!city.trim()){
                return;
            }
        
            try{
                // 1️⃣ Fetch city details (state & country)
                const geoRes = await fetch(`${baseApiUrl}/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
                const geoData = await geoRes.json();
    
                if(geoData.length === 0){
                    return;
                }
    
                const {name, state, country, lat, lon} = geoData[0];
    
                 // 2️⃣ Fetch weather using lat & lon
                const weatherRes = await fetch(`${baseApiUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
                const weatherData = await weatherRes.json();
                 // 3️⃣ Get Timezone Offset from API (in seconds)
                const timezoneOffset = weatherData.timezone; 
    
                // 4️⃣ Get Current UTC Time
                const now = new Date();
                 // 5️⃣ Convert UTC Time to Local Time
                const localTime = new Date(now.getTime() + timezoneOffset * 1000)
                .toLocaleTimeString("en-US", { 
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                });
    
    
                const combinedData = {
                    city: name,
                    state: state || "N/A",
                    country,
                    lat,
                    lon,
                    iconUrl: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`, // Formed icon URL
                    time: localTime,  // Final time formatted
                    ...weatherData, // Merging full weather API response
                };
    
                if (weatherData.cod === 200) {
                    storeWeatherData(combinedData);
                } else {
                }
                }
            catch{
            }
        }
 
    return(
       <BodyWrapper>
            {searchHistory.length === 0 ? (
                <div style={emptyStyles.container}>
                    <h2 style={emptyStyles.text}>Enter a city name to verify and fetch weather details.</h2>
                </div>
            ) : (
                <>
                <TopNavBar>
                    {searchHistory.map((c, index) => (
                        <TopNavBarItem 
                            onClick={() => fetchWeatherData(c)}
                            key={index}>{c}</TopNavBarItem>
                    ))}
                </TopNavBar>
            
                <WeatherDataProvider>
                    <MainContainer>
                        <Box sx={{
                            padding: "20px 10px"
                        }}>
                           <Typography variant="h5">
                                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                    <span>{weatherData.city},</span>
                                    <span>{weatherData.state}</span>
                                    <span>{weatherData.main.temp}°C</span><img SX={{background: "#0a0a23"}} src={weatherData.iconUrl} alt="Weather icon" width="60" height="60" />
                                </Box>
                            </Typography>
                            <Typography>{weatherData.time}</Typography>
                        </Box>
                    </MainContainer>
                </WeatherDataProvider>
            </>
               
            )}
       </BodyWrapper>
    )
}

export default Body;