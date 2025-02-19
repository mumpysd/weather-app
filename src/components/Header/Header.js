import React, { useContext, useState } from "react";
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { SearchHistoryContext, SearchHistoryProvider } from '../../contexts/SearchHistoryContext';
import { WeatherDataContext } from "../../contexts/WeatherDataContext";
import useWeather from "../../customHooks/useWeather";

    
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
    const { addCity } = useContext(SearchHistoryContext);
    const { fetchWeatherData, loading, error } = useWeather();
  
    const [city, setCity] = useState("");
    const [localError, setLocalError] = useState(null);
  
    const handleSearch = async () => {
      if (!city.trim()) return;
      
      setLocalError(null);
      
      const success = await fetchWeatherData(city, 7);
  
      if (success) {
        addCity(city); // Only add city if valid data is returned
        setCity(""); // Clear input after search
      } else {
        setLocalError("❌ Invalid city name. Please try again.");
      }
    };
  
    return (
      <Box sx={{ flexGrow: 1 }}>
        <HeaderAppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              🌤 Weather App ☁️
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon sx={{ color: "#ccc", fontSize: "20px" }} />
              </SearchIconWrapper>
              <StyledInputBase
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={handleSearch} // ✅ Triggers validation when input loses focus
                onKeyDown={(e) => e.key === "Enter" && handleSearch()} // ✅ Triggers on Enter key press
                placeholder="Search Location"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            {loading && <p>Fetching weather data...</p>}
            {(error || localError) && (
              <p style={{ color: "red", marginTop: "14px" }}>{error || localError}</p>
            )}
          </Toolbar>
        </HeaderAppBar>
      </Box>
    );
  };
export default Header;

  
