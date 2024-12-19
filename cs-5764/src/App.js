import React from 'react';
import './App.css';
import ChoroplethWindow from './components/choropleth/ChoroplethWindow';
import DetailView from './components/detailview/DetailView';
import { useState, useEffect } from 'react';

// import dataset from './data/compensation/states/2023.json'
import dataset from './data/compensation/states/state_M2023_dl.json'

import SetJobBar from './components/choropleth/SetJobBar';
const DEFAULT_YEAR = 2023
const DEFAULT_OCCUPATION = "Software Developers"
// const DEFAULT_METRIC = "annual_mean_wage"
const DEFAULT_METRIC = "annual_median_wage"

const DEFAULT_SELECTED = "United States"

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [data, setData] = useState(dataset);
  const [year, setYear] = useState(DEFAULT_YEAR);
  const [job, setJob] = useState(DEFAULT_OCCUPATION);
  const [metric, setMetric] = useState(DEFAULT_METRIC);
  const [jobLabels, setJobLabels] = useState([]);

  const [selected, setSelected] = useState(DEFAULT_SELECTED);

  useEffect(() => { // load on first run
    if (!isInitialized) {
        setIsInitialized(true);
        // console.log("awjfaweufauw0e9f09j09!!!", Object.keys(data.find((obj) => obj.State === "Virginia")).splice(0, 5))
        // setJobLabels(Object.keys(data.find((obj) => obj.State === "Virginia")).splice(2, 7))
        setJobLabels(["Computer Systems Analysts", "Network and Computer Systems Administrators", "Software Developers", "Web Developers", "Data Scientists"])
    }
  }, [isInitialized, job]);


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
          <SetJobBar
            jobLabels = {jobLabels}
            job = {job}
            setJob = {setJob}
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
