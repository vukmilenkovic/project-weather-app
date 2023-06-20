import '@fontsource/outfit';
import Graph from './components/Graph';
import Home from './components/Home';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'; 

function App() {
    return (
      <Router>
        <div className="App" >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/graph" element={<Graph />} />
          </Routes>
		    </div>
      </Router>
      
    );
  }



export default App;
