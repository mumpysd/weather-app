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
            // 1️⃣ Fetch city details (state & country)
            const geoRes = await fetch(`${baseApiUrl}/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
            const geoData = await geoRes.json();

            if(geoData.length === 0){
                setError("❌ Invalid city name. Please try again.");
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
                addCity(city);
                storeWeatherData(combinedData);
            } else {
                setError("❌ Invalid city name. Please try again.");
            }

            setCity("");
        }
        catch{
            setError("⚠️ Error fetching data. Please check your API key.");
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

  
