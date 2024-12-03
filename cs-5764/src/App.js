import React from 'react';
import './App.css';
import ChoroplethWindow from './components/choropleth/ChoroplethWindow';
import DetailView from './components/detailview/DetailView';
import { useState, useEffect } from 'react';

// let csvdata = (await FileAttachment("unemployment-x.csv").csv()).map(d => ({...d, rate: +d.rate}))
// import dataset from './data/unemployment.json';
import dataset from './data/bachelorsinworkforce/8-33_all.json'
const DEFAULT_YEAR = 2000


function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [data, setData] = useState(dataset);
  const [year, setYear] = useState(DEFAULT_YEAR);

  useEffect(() => { // load on first run
    if (!isInitialized) {
        setIsInitialized(true);
        console.log(data);
    }
    else{
          // console.log(data); // ensure this updates
    }

  }, [isInitialized]);


  return (
    <div className="App">
      <div className="BigContainer">
        <div className="ContainerWindow">
          <ChoroplethWindow 
            data = {data}
            year = {year}
            isInitialized = {isInitialized}
          />
        </div>
        <div className='ContainerDetail'>
          <DetailView
            data = {data}
            year = {year}
            isInitialized = {isInitialized}
          />
        </div>
      </div>

    </div>
  );
}

export default App;
