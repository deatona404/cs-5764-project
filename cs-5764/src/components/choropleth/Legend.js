import React from 'react';
import './Legend.css'

function Legend(props) {
    return (
        <div className='legend'>
            <p className='legend_title'>Median Annual Salary</p>
            {props.range.map((color, index) => (
                <div key={index}className="legend_entry">
                    <div className='legend_color' style={{backgroundColor: color}}></div>
                    <div className='legend_text'>
                        {index === 0 ? (
                            "< $" + props.thresholds[index]
                        ) : index === props.range.length - 1 ? (
                            "> $" + props.thresholds[index - 1]
                        ) : (
                            "$" + props.thresholds[index - 1] + " - $" + props.thresholds[index]
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Legend;
