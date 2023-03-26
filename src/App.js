
import FileUploader from './components/FileUploader';
import TsParticle from './components/TsParticle';
import './assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <div className="maincontainer">
      <div className="mainbox"><FileUploader /></div>
      <div className="particles-container">
        <TsParticle />
      </div>
    </div>
  );
}

export default App;
