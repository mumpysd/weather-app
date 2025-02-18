import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
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

                // Get current hour in 24-hour format
                const currentHour = new Date().getHours();

                // Filter the next 9 hours of data
                const next9HoursData = geoData?.forecast?.forecastday[0].hour.filter(
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

        console.log(weatherData);
 
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
                        <Grid container spacing={2} sx={{marginTop: "0px"}}>
                            <Grid item xs={12} md={8} lg={8}>
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


                                <Box 
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    marginTop="20px"
                                    flexWrap="wrap"
                                    sx={{
                                        border: "1px solid #1b1b32"
                                    }} 
                                    gap={1}>
                                    {weatherData?.hoursData.map((hour, index) => (
                                        <Box key={index}  sx={{margin: '10px'}}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: {xs: "10px", sm: "12px"}
                                                }}>{new Date(hour.time).toLocaleString("en-US", { hour: "numeric", hour12: true })}</Typography>

                                                <img src={`https:${hour.condition.icon}`} alt={hour.condition.text}  width="30" height="30" />

                                            <Typography
                                                sx={{
                                                    fontWeight: "600",
                                                    fontSize: {xs: "10px", sm: "12px"}
                                                }}>{`${hour.temp_c}°C`}</Typography>
                                        </Box>
                                    ))}
                                </Box>

                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} sx={{display: "none"}}>
                                <Box sx={{border: "1px solid #000"}}>
                                    <TableContainer sx={{width: "100%"}}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Day</TableCell>
                                                <TableCell>Min/Max</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Coming</TableCell>
                                                <TableCell>Soon!</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </TableContainer>
                                </Box>
                            </Grid>
                        </Grid>
                       
                    </MainContainer>
                </WeatherDataProvider>
               
            </>
               
            )}
       </BodyWrapper>
    )
}

export default Body;