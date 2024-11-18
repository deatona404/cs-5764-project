import './DetailView.css'
import NationalOverview from './NationalOverview';

function DetailView(props) {
    return <div className='DetailView'>
      {/* detailview!!! */}
      <NationalOverview
        data = {props.data}
      />
      </div>;
  }
  
  export default DetailView;
  