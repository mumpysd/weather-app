import { Box, Typography } from "@mui/material";
import styled from "@emotion/styled/macro";
import { SearchHistoryContext, SearchHistoryProvider } from "../../contexts/SearchHistoryContext";
import { useContext } from "react";
import { WeatherDataContext, WeatherDataProvider } from "../../contexts/WeatherDataContext";

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
    fontWeight: "bold"
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
    const {weatherData} = useContext(WeatherDataContext);

    console.log(weatherData);
 
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
                        <TopNavBarItem key={index}>{c}</TopNavBarItem>
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
                                    <span>{weatherData.main.temp} °C</span><img src={weatherData.iconUrl} alt="Weather icon" width="40" height="40" />
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