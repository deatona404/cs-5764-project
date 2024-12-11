import './SetJobBar.css'
// import NationalOverview from './NationalOverview';
// import StateView from './StateView';

function SetJobBar(props) {
    //  note props.SetJob is the function to change job


//   console.log(props.selected)
    return (<div className="SetJobBar">
      <select
        // className="SetJobBarInput"
        type="text"
        value={props.job}
        onChange={(e) => props.setJob(e.target.value)}
        // placeholder="Type something..."
        // style={inputStyle}
      >
            <option value="" disabled>
            Select a job
            </option>
            {props.jobLabels.map((label, index) => (
            <option key={index} value={label}>
                {label}
            </option>
            ))}



      </select>
    </div>);
  }
  
  export default SetJobBar;
  