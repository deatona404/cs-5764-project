import React from 'react';
import './App.css';
import ChoroplethWindow from './components/choropleth/ChoroplethWindow';
import DetailView from './components/detailview/DetailView';
import { useState, useEffect } from 'react';

// let csvdata = (await FileAttachment("unemployment-x.csv").csv()).map(d => ({...d, rate: +d.rate}))
// import dataset from './data/unemployment.json';
// import dataset from './data/bachelorsinworkforce/8-33_all.json'
import dataset from './data/compensation/states/2023.json'
const DEFAULT_YEAR = 2000
const DEFAULT_OCCUPATION = "Software Developers"
const DEFAULT_METRIC = "annualmeanwage"

const DEFAULT_SELECTED = "United States"

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [data, setData] = useState(dataset);
  const [year, setYear] = useState(DEFAULT_YEAR);
  const [job, setJob] = useState(DEFAULT_OCCUPATION);
  const [metric, setMetric] = useState(DEFAULT_METRIC);

  const [selected, setSelected] = useState(DEFAULT_SELECTED);

  useEffect(() => { // load on first run
    if (!isInitialized) {
        setIsInitialized(true);
        console.log(data);
    }
    else{
      setSelected("Alabama") // for testing
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
            job = {job}
            metric = {metric}
            selected = {selected}
            setSelected = {setSelected}
            isInitialized = {isInitialized}
          />
        </div>
        <div className='ContainerDetail'>
          <DetailView
            data = {data}
            year = {year}
            job = {job}
            metric = {metric} // might be unnecessary for this?
            selected = {selected}
            setSelected = {setSelected}
            isInitialized = {isInitialized}
          />
        </div>
      </div>

    </div>
  );
}

export default App;
