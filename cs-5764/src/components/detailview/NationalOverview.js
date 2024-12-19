import './NationalOverview.css'
import BarSet from './BarSet';
import { useState, useEffect } from 'react';

function NationalOverview(props) {
    const [isInitialized, setIsInitialized] = useState(false);
    let nationalData = {}
    const [data, setData] = useState({});

    useEffect(() => { // load on first run
        if (!isInitialized) {
            setIsInitialized(true);
        }
        else {
            nationalData = props.data
            console.log(props.data)
            console.log(props.job)
            let result = []
            
            for (const i in nationalData) {
                let row = {}
                row.title = nationalData[i].state
                row[props.metric] = nationalData[i][props.job][props.metric]
                row["annual_10th_percentile_wage"] = nationalData[i][props.job]["annual_10th_percentile_wage"]
                row["annual_25th_percentile_wage"] = nationalData[i][props.job]["annual_25th_percentile_wage"]
                row["annual_75th_percentile_wage"] = nationalData[i][props.job]["annual_75th_percentile_wage"]
                row["annual_90th_percentile_wage"] = nationalData[i][props.job]["annual_90th_percentile_wage"]

                result.push(row)
            }
            console.log("national view result", result)
            result.sort((a, b) => b[props.metric] - a[props.metric])
            setData(result)
        }
    
    }, [isInitialized, props.selected, props.data, props.job]);

    return (
        <div className='NationalOverview'>
            <h1>National Overview</h1>
            <BarSet
                title="Median Annual Salary by State"
                data = {data}
                max = {209910} // FIXME: un-hardcode that number there, its cali max 75th percentile salary
            />
        </div>
    )
  }
  
  export default NationalOverview;
  