import { Box } from "@mui/material";
import styled from "@emotion/styled/macro";
import { SearchHistoryContext, SearchHistoryProvider } from "../../contexts/SearchHistoryContext";
import { useContext } from "react";

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
            
                <MainContainer></MainContainer>
            </>
               
            )}
       </BodyWrapper>
    )
}

export default Body;