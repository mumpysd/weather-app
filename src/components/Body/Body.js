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

const TopNavBarItem = styled('div') (({isActive}) => ({
    background: isActive ? "#1976d2" : "#0a0a23",
    width: "auto",
    height: "30px",
    color: isActive ? "#fff" : "#fff",
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
}));

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

    const fetchWeatherData = async (city) => {
            if(!city.trim()){
                return;
            }
        
            try{
                const geoRes = await fetch(`${baseApiUrl}/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=yes&alerts=yes`);
                const geoData = await geoRes.json();
    
                if(geoData.length === 0){
                    return;
                }
    
                if(geoData?.location?.name.toLowerCase() !== city.toLowerCase()){
                    return;
                }
    
                const {name, region, country, lat, lon} = geoData['location'];
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
    
    
                const combinedData = {
                    city: name,
                    state: region || "N/A",
                    country,
                    lat,
                    lon,
                    time: formattedDate,  // Final time formatted
                    ...geoData, // Merging full weather API response
                };
    
                if(geoData?.location?.length !== 0){
                    storeWeatherData(combinedData);
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
                <WeatherDataProvider>
                <TopNavBar>
                    {searchHistory.map((c, index) => (
                        <TopNavBarItem 
                            onClick={() => fetchWeatherData(c)}
                            isActive={c.toLowerCase() === weatherData.city.toLowerCase()}
                            key={index}>{c}</TopNavBarItem>
                    ))}
                </TopNavBar>
            
              
                <MainContainer>
                    <Box sx={{
                        padding: "20px 10px"
                    }}>
                        <Typography 
                            variant="h5"
                            sx={{
                                fontSize: {xs: "1rem", sm: "1.5rem"}
                            }}>
                            <Box 
                                display="flex"
                                alignItems="center"
                                justifyContent="center" 
                                gap={1}
                               >
                                <span>{weatherData.city},</span>
                                <span>{weatherData.state}</span>
                                <span>{weatherData?.current?.temp_c}°C</span><img sx={{background: "#0a0a23"}} src={`https:${weatherData.current.condition.icon}`} alt={weatherData.current.condition.text} width="60" height="60" />
                            </Box>
                        </Typography>
                        <Typography
                         sx={{
                            fontSize: {xs: "0.8rem", sm: "1rem"}
                        }}>{weatherData.time}</Typography>
                    </Box>
                </MainContainer>
                </WeatherDataProvider>
               
            </>
               
            )}
       </BodyWrapper>
    )
}

export default Body;