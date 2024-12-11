import React from 'react';
import './StateView.css'
import BarSet from './BarSet';
import * as d3 from "d3";
import { useRef, useState, useEffect } from 'react';


function StateView(props) {
    const [isInitialized, setIsInitialized] = useState(false);
    let stateData = {}
    let svgRef = useRef(null)

    // let labels = []
    const [labels, setLabels] = useState([]);
    // let meansalaries = []
    const [meansalaries, setMeansalaries] = useState([]);
    const [jobTitleMax, setJobTitleMax] = useState(0);

    


    useEffect(() => { // load on first run
        if (!isInitialized) {
            setIsInitialized(true);
            stateData = props.data.find((obj) => obj.State === props.selected)
            
            // console.log(data);
        }
        else{
            stateData = props.data.find((obj) => obj.State === props.selected)
            // console.log(props.data.find((obj) => obj.State == props.selected))

            setLabels(Object.keys(stateData).splice(0, 5))
            setMeansalaries(Object.entries(stateData).map((obj, i) => obj[1]["annualmeanwage"]).splice(0, 5))
            setJobTitleMax(Math.max(...Object.entries(stateData).map((obj, i) => obj[1]["annualmeanwage"]).splice(0, 5)))
            console.log(labels)
            console.log(meansalaries)
            console.log(jobTitleMax)



        //   setSelected("North Carolina") // for testing
              // console.log(data); // ensure this updates
        }
    
      }, [isInitialized, props.selected, props.data]);


    return <div className='StateView'>
        {/* sahgsdjkhfgsjkdh */}
        <h1>{props.selected}</h1>
        
        <BarSet
            title="Pay by title"
            labels = {labels}
            data = {meansalaries}
            max = {173780}
        />
        {/* FIXME: un-hardcode that number there, its cali max salary */}
        
        </div>;
  }

  


export default StateView;
  