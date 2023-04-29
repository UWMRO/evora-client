import './App.css';
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import ImageTypeSelector from './components/ImageTypeSelector';
import SetTemp from './components/SetTemp';
import GetTemp from './components/GetTemp';
import ExposureTypeSelector from './components/SetExposureType';
import FilterTypeSelector from './components/FilterControls';
import ExposureControls from './components/ExposureControls';
import PingServer from './components/PingServer';
import logo from './aueg_logo.png'
import DownloadCapture from './components/DownloadCapture';

// https://github.com/ericmandel/js9

// Use python http.server to serve downloaded files?

function App() {
  const [exposureType, setExposureType] = useState('Single')
  const [imageType, setImageType] = useState('Bias')
  const [filterType, setFilterType] = useState('Ha')
  const [temp, setTemp] = useState()
  const [currTemp, setCurrTemp] = useState()

  
  useEffect(()=>{setTimeout(()=>window.JS9.Load(process.env.PUBLIC_URL + '/coma.fits'), 500)})


  return (
    <div className='App' > 
    <a href='https://sites.google.com/a/uw.edu/mro/' target='_blank' rel='noreferrer'>
      <img src={logo} className='Logo' alt='Logo'/>
    </a>
    <h1 className='Title'>Manastash Ridge Observatory Controls</h1>
    
      <PingServer/>
      <ImageTypeSelector imageType={imageType} setImageType={setImageType}/>
      <ExposureTypeSelector exposureType={exposureType} setExposureType={setExposureType}/>
      <FilterTypeSelector filterType={filterType} setFilterType={setFilterType}/>
      <SetTemp temp={temp} setTemp={setTemp}/>
      <GetTemp currTemp={currTemp} setCurrTemp={setCurrTemp}/>
      <ExposureControls
        exposureType={exposureType} 
        imageType={imageType} 
        filterType={filterType}
        temp = {temp}
      />
      

      <div className="JS9Menubar"></div>
      <div className="JS9"></div>
      <div className="JS9Statusbar"></div>
      
    
    </div>
    
  );
}

export default App;
