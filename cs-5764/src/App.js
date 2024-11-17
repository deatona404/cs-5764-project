import './App.css';
import ChoroplethWindow from './components/choropleth/ChoroplethWindow';
import DetailView from './components/detailview/DetailView';

function App() {
  return (
    <div className="App">
      <div className="BigContainer">
        <div className="ContainerWindow">
          <ChoroplethWindow/>
        </div>
        <div className='ContainerDetail'>
          <DetailView/>
        </div>
      </div>

    </div>
  );
}

export default App;
