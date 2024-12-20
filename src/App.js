import { useEffect, useState } from "react";
import './App.css';
import { getStatus } from "./apiClient";
import logo from './aueg_logo.png';
import ExposureControls from './components/ExposureControls';
import FilterTypeSelector from './components/FilterControls';
import Focus from "./components/Focus";
import Framing from "./components/Framing";
import GetStatus from './components/GetStatus';
import GetTemp from './components/GetTemp';
import ImageTypeSelector from './components/ImageTypeSelector';
import OnOff from './components/OnOffFunctionality';
import ExposureTypeSelector from './components/SetExposureType';
import SetTemp from './components/SetTemp';
import WeatherIcon from './weather_icon.png';
import Feedback from './components/Feedback';
import Weather from './components/Weather';

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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(
    () => {
      if (isLoading) {
        // On page load, display the default image and set the zoom to fit (after some
        // delays to allow JS9 to load and display on the image properly).
        setTimeout(
          () => {
            window.JS9.Load(displayedImage);
            setTimeout(() => window.JS9.SetZoom('toFit'), 1000);
            setIsLoading(false);
          }, 2000)
        } else {
          // For images captured by the camera after the initial load, refresh the 
          // image, which preservers the current settings (e.g. zoom, pan, etc.)
          window.JS9.RefreshImage(displayedImage);
        }
      }, [displayedImage, isLoading])

  return (
    <div className='App' >
    <h1 className='Title' style={{fontSize: '20px'}}>Manastash Ridge Observatory Controls</h1>
    <div className="Interface">
      <div className="Controls">
        {/* <PingServer/> */}
        <OnOff initialized={initialized} setInitialized={setInitialized}/>
        <GetStatus currStatus={currStatus} setCurrStatus={setCurrStatus}/>
        <ImageTypeSelector imageType={imageType} setImageType={setImageType} isDisabled={disableControls || !initialized}/>
        <ExposureTypeSelector exposureType={exposureType} setExposureType={setExposureType} isDisabled={disableControls || !initialized}/>
        <FilterTypeSelector filterType={filterType} setFilterType={setFilterType} isDisabled={disableControls || !initialized}/>
        <SetTemp temp={temp} setTemp={setTemp} isDisabled={disableControls || !initialized}/>
        <GetTemp currTemp={currTemp} setCurrTemp={setCurrTemp} isDisabled={!initialized}/>
        <ExposureControls
          exposureType={exposureType}
          imageType={imageType}
          filterType={filterType}
          temp={temp}
          setDisplayedImage={setDisplayedImage}
          setDisableControls={setDisableControls}
          isDisabled={!initialized}
        />
        <Framing isDisabled={disableControls || !initialized}/>
        <Focus isDisabled={disableControls || !initialized}/>
        
      </div>
      <div className="display">
        <div className="JS9Menubar"></div>
        <div className="JS9"></div>
        <div className="JS9Statusbar"></div>
      </div>
    </div>

    <Weather />

    <a href='https://sites.google.com/a/uw.edu/mro/' target='_blank' rel='noreferrer'>
      <img src={logo} className='Logo' alt='Logo'/>
    </a>

    <a href='https://www.wunderground.com/dashboard/pws/KWAELLEN214' target='_blank' rel='noreferrer'>
      <img src={WeatherIcon} className='WeatherIcon' alt='WeatherIcon'/>
    </a>

    <Feedback/>

    </div>
  );
}

export default App;
