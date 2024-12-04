import './DetailView.css'
import NationalOverview from './NationalOverview';
import StateView from './StateView';

function DetailView(props) {
  console.log(props.selected)
    return <div className='DetailView'>
      {
        // conditional operator, shows national overview
        // if we have no state selected. otherwise,
        // it will show the appropriate state view.
        (props.selected == "United States") ? (<NationalOverview
          data = {props.data}
          year = {props.year}
          job = {props.job}
          metric = {props.metric}
        />) : (<StateView
          data = {props.data}
          year = {props.year}
          job = {props.job}
          metric = {props.metric}
          selected = {props.selected}
        />)
    }
      {/* <NationalOverview
        data = {props.data}
        year = {props.year}
        job = {props.job}
        metric = {props.metric}
      />

      <StateView
        data = {props.data}
        year = {props.year}
        job = {props.job}
        metric = {props.metric}
        selected = {props.selected}
      /> */}
      </div>;
  }
  
  export default DetailView;
  