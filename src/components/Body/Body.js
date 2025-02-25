import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import styled from "@emotion/styled/macro";
import { SearchHistoryContext, SearchHistoryProvider } from "../../contexts/SearchHistoryContext";
import { useContext } from "react";
import { WeatherDataContext, WeatherDataProvider } from "../../contexts/WeatherDataContext";
import { baseApiUrl, apiKey } from "../../constants";
import useWeather from "../../customHooks/useWeather";

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

   // Map AQI index to category
   const getAqiCategory = (aqi) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const Body = () => {
    const { searchHistory } = useContext(SearchHistoryContext);
    const { weatherData } = useContext(WeatherDataContext);
    const { fetchWeatherData, loading, error } = useWeather();

    const airQuality = weatherData?.forecast?.forecastday[0]?.day?.air_quality;
    const pm25 = airQuality["pm2_5"];
  
    return (
      <BodyWrapper>
        {searchHistory.length === 0 ? (
          <div style={emptyStyles.container}>
            <h2 style={emptyStyles.text}>
              Enter a city name to verify and fetch weather details.
            </h2>
          </div>
        ) : (
          <>
            <WeatherDataProvider>
              <TopNavBar>
                {searchHistory.map((c, index) => (
                  <TopNavBarItem
                    onClick={() => fetchWeatherData(c, 7)}
                    isActive={c.toLowerCase() === weatherData?.city?.toLowerCase()}
                    key={index}
                  >
                    {c}
                  </TopNavBarItem>
                ))}
              </TopNavBar>
  
              <MainContainer>
                {loading && <p>Loading weather data...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}
  
                <Grid container spacing={2} sx={{ marginTop: "0px" }}>
                  <Grid item xs={12} md={8} lg={8}>
                    <Box sx={{ padding: "20px 10px" }}>
                      {weatherData && (
                        <>
                          <Typography
                            variant="h5"
                            sx={{
                              fontSize: { xs: "1rem", sm: "1.5rem" },
                            }}
                          >
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              gap={1}
                            >
                              <span>{weatherData.city},</span>
                              <span>{weatherData.state}</span>
                              <span>
                                {Math.round(weatherData?.current?.temp_c)}°C
                              </span>
                              <img
                                sx={{ background: "#0a0a23" }}
                                src={`https:${weatherData.current.condition.icon}`}
                                alt={weatherData.current.condition.text}
                                width="60"
                                height="60"
                              />
                            </Box>
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.8rem", sm: "1rem" },
                            }}
                          >
                            {weatherData.time}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.8rem", sm: "1rem" },
                            }}
                          >
                           <span><strong>AQI:</strong>{Math.round(pm25 * 3.24)} ({getAqiCategory(Math.round(pm25 * 3.24))})</span>
                          </Typography>
  
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            marginTop="20px"
                            flexWrap="wrap"
                            sx={{
                              border: "1px solid #1b1b32",
                            }}
                            gap={1}
                          >
                            {weatherData?.hoursData.map((hour, index) => (
                              <Box key={index} sx={{ margin: "10px" }}>
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: "10px", sm: "12px" },
                                  }}
                                >
                                  {new Date(hour.time).toLocaleString("en-US", {
                                    hour: "numeric",
                                    hour12: true,
                                  })}
                                </Typography>
  
                                <img
                                  src={`https:${hour.condition.icon}`}
                                  alt={hour.condition.text}
                                  width="30"
                                  height="30"
                                />
  
                                <Typography
                                  sx={{
                                    fontWeight: "600",
                                    fontSize: { xs: "10px", sm: "12px" },
                                  }}
                                >
                                  {Math.round(hour.temp_c)}°C
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4} lg={4}>
                    <Box sx={{ border: "1px solid #000", marginBottom: "20px" }}>
                        <div className="p-4">
                            <div>
                                <p sx={{marginBottom: "10px"}}><strong>Day Min/Max</strong></p>
                                {weatherData?.next7HoursDay.map((day) => (
                                    <p key={day.date}
                                        className="my-2 p-2 border rounded"
                                        sx={{margin: "0px", fontSize: "14px", fontWeight: "400", display:"flex", justifyContent: "center", alignItems: "center"}}>
                                        <strong>{new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}</strong> 

                                        <img
                                            src={`https:${day.day.condition.icon}`}
                                            alt={day.day.condition.text}
                                            width="25"
                                            height="25"
                                        />

                                        <span>{Math.round(day.day.mintemp_c)}°C / {Math.round(day.day.maxtemp_c)}°C</span>
                                    </p>
                                ))}
                            </div>
                        </div>
                    </Box>
                  </Grid>
                </Grid>
              </MainContainer>
            </WeatherDataProvider>
          </>
        )}
      </BodyWrapper>
    );
  };

export default Body;