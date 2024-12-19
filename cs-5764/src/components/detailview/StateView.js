import React from 'react';
import './StateView.css'
import BarSet from './BarSet';
import { useState, useEffect } from 'react';


function StateView(props) {
    const [isInitialized, setIsInitialized] = useState(false);
    let stateData = {}
    const [data, setData] = useState({});

    

    useEffect(() => { // load on first run
        if (!isInitialized) {
            setIsInitialized(true);
            stateData = props.data.find((obj) => obj.state === props.selected)
        }
        else {
            console.log("stateview data", props.data)
            stateData = props.data.find((obj) => obj.state === props.selected)
            let result = []

            for (const key in stateData) {
                console.log("key", key)
                if (typeof stateData[key] === "object" && stateData[key] !== null) {
                    result.push({
                        title: key,
                        ...stateData[key]
                    })
                }
            }

            console.log("result !!!!!!!", result)

            // result.sort((a, b) => b.annualmeanwage - a.annualmeanwage) // uncomment to sort descending
            setData(result)
        }
    
      }, [isInitialized, props.selected, props.data]);


    return (
        <div className='StateView'>
            <h1>{props.selected}</h1>
            
            <BarSet
                title="Pay by title"
                data = {data}
                max = {173780} // FIXME: un-hardcode that number there, its cali max salary
            />
        </div>
    )
}

export default StateView;
