import React, { useContext, useState } from "react";
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { SearchHistoryContext, SearchHistoryProvider } from '../../contexts/SearchHistoryContext';
import { baseApiUrl, apiKey } from "../../constants";
import { WeatherDataContext } from "../../contexts/WeatherDataContext";

    
const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    color: "#000",
    backgroundColor: "#f1f2f2",
    '&:hover': {
        backgroundColor: "#f1f2f2"
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
}));

const  SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
      fontSize: "14px"
    },
}));

const HeaderAppBar = styled(AppBar) ({
    background: "#002ead"
});


const Header = () => {

    const {addCity} = useContext(SearchHistoryContext);

    const [city, setCity] = useState("");
    const [error, setError] = useState(null);

    const context = useContext(WeatherDataContext);

    if (!context) {
      return <p>Loading...</p>; // ✅ Prevents undefined error
    }
  
    const {storeWeatherData} = context;

    const validateCity = async () => {
        if(!city.trim()){
            return;
        }

        setError(null);

        try{
            const geoRes = await fetch(`${baseApiUrl}/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=yes&alerts=yes`);
            const geoData = await geoRes.json();
            
            if(geoData?.location?.name.toLowerCase() !== city.toLowerCase()){
                setError("City not found or mismatch!");
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

            if(geoData['location'].length !== 0){
                addCity(city);
                storeWeatherData(combinedData);
            } else {
                setError("❌ Invalid city name. Please try again.");
            }

            setCity("");
        }
        catch(err){
            setError("Error fetching weather data:");
        }
    }

    return(
        <Box sx={{ flexGrow: 1 }}>
            <HeaderAppBar position="static">
                <Toolbar>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    🌤 Weather App ☁️
                </Typography>
                    <Search>
                        <SearchIconWrapper>
                        <SearchIcon sx={{color: "#ccc", fontSize: "20px"}} />
                        </SearchIconWrapper>
                        <StyledInputBase
                        value={city}
                        onChange={(e) => setCity(e.target.value)} // Allows proper typing
                        onBlur={() => validateCity(city)} // ✅ Calls handleSearch when focus is lost
                        onKeyDown={(e) => e.key === "Enter" && validateCity(city)} // ✅ Calls on Enter key press
                        placeholder="Search Location"
                        inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    {error && <p style={{ color: "red", marginTop: "14px" }}>{error}</p>}
                </Toolbar>
            </HeaderAppBar>
        </Box>
    )
}

export default Header;

  
