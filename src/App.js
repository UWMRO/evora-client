import { useEffect, useState } from "react";
import './App.css';
import { getStatus } from "./apiClient";
import logo from './aueg_logo.png';
import ExposureControls from './components/ExposureControls';
import FilterTypeSelector from './components/FilterControls';
import GetStatus from './components/GetStatus';
import GetTemp from './components/GetTemp';
import ImageTypeSelector from './components/ImageTypeSelector';
import OnOff from './components/OnOffFunctionality';
import ExposureTypeSelector from './components/SetExposureType';
import SetTemp from './components/SetTemp';

// https://github.com/ericmandel/js9

// Use python http.server to serve downloaded files?

/**
 * Main page of MRO Controls. Contains all child elements.
 */
function App() {
  const [exposureType, setExposureType] = useState('Single')
  const [imageType, setImageType] = useState('Bias')
  const [filterType, setFilterType] = useState('Ha')
  const [temp, setTemp] = useState()
  const [currTemp, setCurrTemp] = useState()
  const [currStatus, setCurrStatus] = useState()
  const [displayedImage, setDisplayedImage] = useState(process.env.PUBLIC_URL + '/coma.fits')
  const [disableControls, setDisableControls] = useState(false)
  const [initialized, setInitialized] = useState(getStatus()['status'] === '20073')


  useEffect(()=>{setTimeout(()=>window.JS9.Load(displayedImage, {refresh: true}), 500)}, [displayedImage])


  return (
    <div className='App' >
    <a href='https://sites.google.com/a/uw.edu/mro/' target='_blank' rel='noreferrer'>
      <img src={logo} className='Logo' alt='Logo'/>
    </a>
    <h1 className='Title'>Manastash Ridge Observatory Controls</h1>

      {/* <PingServer/> */}
      <OnOff initialized={initialized} setInitialized={setInitialized}/>
      <GetStatus currStatus={currStatus} setCurrStatus={setCurrStatus} isDisabled={!initialized}/>
      <ImageTypeSelector imageType={imageType} setImageType={setImageType} isDisabled={disableControls || !initialized}/>
      <ExposureTypeSelector exposureType={exposureType} setExposureType={setExposureType} isDisabled={disableControls || !initialized}/>
      <FilterTypeSelector filterType={filterType} setFilterType={setFilterType} isDisabled={disableControls || !initialized}/>
      <SetTemp temp={temp} setTemp={setTemp} isDisabled={disableControls || !initialized}/>
      <GetTemp currTemp={currTemp} setCurrTemp={setCurrTemp} isDisabled={!initialized}/>
      <ExposureControls
        exposureType={exposureType}
        imageType={imageType}
        filterType={filterType}
        temp = {temp}
        setDisplayedImage = {setDisplayedImage}
        setDisableControls = {setDisableControls}
        isDisabled = {!initialized}
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
