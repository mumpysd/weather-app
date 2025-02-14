import './App.css';
import Body from './components/Body/Body';
import Header from './components/Header/Header';
import { SearchHistoryProvider } from './contexts/SearchHistoryContext';

function App() {
  return (
     <div className="App">
         <SearchHistoryProvider>
            <Header/>
            <Body/>
         </SearchHistoryProvider>
     </div>
  );
}

export default App;
