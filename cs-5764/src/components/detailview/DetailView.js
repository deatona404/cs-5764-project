import './DetailView.css'
import NationalOverview from './NationalOverview';
import StateView from './StateView';

function DetailView(props) {
    return (
        <div className='DetailView'>
            {
                (props.selected == "United States") ? (
                    <NationalOverview
                        data = {props.data}
                        year = {props.year}
                        job = {props.job}
                        metric = {props.metric}
                    />
                ) : (
                    <StateView
                        data = {props.data}
                        year = {props.year}
                        job = {props.job}
                        metric = {props.metric}
                        selected = {props.selected}
                    />
                )
            }
        </div>
    )
}
  
export default DetailView;
  