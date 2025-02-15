import './App.css';
import Body from './components/Body/Body';
import Header from './components/Header/Header';
import { SearchHistoryProvider } from './contexts/SearchHistoryContext';
import { WeatherDataProvider } from './contexts/WeatherDataContext';

function App() {
  return (
          <WeatherDataProvider> {/* ✅ Wrap everything inside this */}
               <SearchHistoryProvider> {/* ✅ Now wrap everything inside this */}
                  <div className="App">
                     <Header/>
                     <Body/>
                  </div>
               </SearchHistoryProvider>
         </WeatherDataProvider>
  );
}

export default App;
