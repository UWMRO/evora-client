import './App.css';
import { useState, useEffect } from "react";
import ImageTypeSelector from './components/ImageTypeSelector';
import SetTemp from './components/SetTemp';
import GetStatus from './components/GetStatus'
import GetTemp from './components/GetTemp';
import ExposureTypeSelector from './components/SetExposureType';
import FilterTypeSelector from './components/FilterControls';
import ExposureControls from './components/ExposureControls';
import PingServer from './components/PingServer';
import OnOff from './components/OnOffFunctionality'
import logo from './aueg_logo.png'
import { getStatus } from "./apiClient"

// https://github.com/ericmandel/js9

// Use python http.server to serve downloaded files?

function App() {
  const [exposureType, setExposureType] = useState('Single')
  const [imageType, setImageType] = useState('Bias')
  const [filterType, setFilterType] = useState('Ha')
  const [temp, setTemp] = useState()
  const [currTemp, setCurrTemp] = useState()
  const [currStatus, setCurrStatus] = useState()
  const [displayedImage, setDisplayedImage] = useState(process.env.PUBLIC_URL + '/coma.fits')
  const [initialized, setInitialized] = useState(getStatus()['status'] === '20073')
  const [disabledExpType, setDisabledExpType] = useState(false)


  useEffect(()=>{setTimeout(()=>window.JS9.Load(displayedImage, {refresh: true}), 500)}, [displayedImage])


  return (
    <div className='App' >
    <a href='https://sites.google.com/a/uw.edu/mro/' target='_blank' rel='noreferrer'>
      <img src={logo} className='Logo' alt='Logo'/>
    </a>
    <h1 className='Title'>Manastash Ridge Observatory Controls</h1>

      <PingServer/>
      <OnOff initialized={initialized} setInitialized={setInitialized}/>
      <GetStatus currStatus={currStatus} setCurrStatus={setCurrStatus}/>
      <ImageTypeSelector imageType={imageType} setImageType={setImageType}/>
      <ExposureTypeSelector exposureType={exposureType} setExposureType={setExposureType} isDisabled={disabledExpType}/>
      <FilterTypeSelector filterType={filterType} setFilterType={setFilterType}/>
      <SetTemp temp={temp} setTemp={setTemp}/>
      <GetTemp currTemp={currTemp} setCurrTemp={setCurrTemp}/>
      <ExposureControls
        exposureType={exposureType}
        imageType={imageType}
        filterType={filterType}
        temp = {temp}
        setDisplayedImage = {setDisplayedImage}
        setDisableExpType = {setDisabledExpType}
      />
      <div className="display">
        <div className="JS9Menubar"></div>
        <div className="JS9"></div>
        <div className="JS9Statusbar"></div>
      </div>
    </div>

  );
}

export default App;
