import { useEffect, useState } from "react";
import { getStatus } from "./apiClient";

import './App.css';
import logo from './aueg_logo.png';

// Icons
import { FaRegStar } from "react-icons/fa";
import { IoTelescopeOutline } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { TiWeatherCloudy } from "react-icons/ti";
import { IoCameraSharp } from "react-icons/io5";
import { VscFeedback } from "react-icons/vsc";
import { CgWebsite } from "react-icons/cg";
import { MdOutlineFilterFrames } from "react-icons/md";

import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";

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

  const [activeTab, setActiveTab] = useState("camera");
  const [sideBarHidden, setSideBarHidden] = useState(false);
  const [infoBarHidden, setInforBarHidden] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const fullScreenHandler = () => {
    checkFullScreen() ? exitFullscreen() : enterFullScreen();
  };

  const enterFullScreen = () => {
    let element = document.documentElement;
  
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {      // Firefox 
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {   // Chrome, Safari, and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {       // IE/Edge 
      element.msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {              // General
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {     // IE11
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {  // Firefox 
      document.mozCancelFullScreen();
    }
  }

  const checkFullScreen = () => {
    return Boolean(
      document.fullscreenElement ||       // Standard
      document.webkitFullscreenElement || // Chrome and Opera
      document.mozFullScreenElement ||    // Firefox
      document.msFullscreenElement        // IE/Edge
    );
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(checkFullScreen());
    }

    // Fullscreen
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      // Fullscreen
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
    };
  }, [setIsFullScreen]);

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
      }, [displayedImage, isLoading, activeTab])

  const controls = [
    { id: 'camera', label: 'Camera Controls', icon: <FaRegStar />},
    { id: 'framing_and_focus', label: 'Framing & Focus', icon: <MdOutlineFilterFrames /> },
    { id: 'telescope', label: 'Telescope Controls', icon: <IoTelescopeOutline />},
    { id: 'settings', label: 'Settings', icon: <IoMdSettings />},
  ];

  const miscLinks = [
    { id: 'website', label: 'MRO Website', icon: <CgWebsite />, link: 'https://sites.google.com/a/uw.edu/mro/'},
    { id: 'weather', label: 'Weather', icon: <TiWeatherCloudy />, link: 'https://www.wunderground.com/dashboard/pws/KWAELLEN214'},
    { id: 'webcams', label: 'Webcams', icon: <IoCameraSharp />, link: 'https://depts.washington.edu/mrouser/webcams/'},
    { id: 'feedback', label: 'Feedback', icon: <VscFeedback  />, link: 'https://forms.gle/eknU5CgwkPckrHs58'},
  ]

  const cameraComponent = (
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
      </div>
      <div className="display">
        <div className="JS9Menubar"></div>
        <div className="JS9"></div>
        <div className="JS9Statusbar"></div>
      </div>
    </div>
  )

  const framingAndFocusComponent = (
    <div className="interface">
      <div className="controls">
        <Framing isDisabled={disableControls || !initialized}/>
        <Focus isDisabled={disableControls || !initialized}/>
      </div>
    </div>
  )

  const telescopeComponent = (
    <>
      <h2 style={{ margin: '10px' }}>Telescope Controls</h2>
      <p className="warning">To be implemented</p>
    </>
  )

  const settingsComponent = (
    <>
      <h2 style={{ margin: '10px'}}>Settings</h2>
      <div style={{ margin: '30px', float: 'left'}}>
        <div>Hide Info Panel <input type="checkbox" checked={infoBarHidden} onChange={() => setInforBarHidden(!infoBarHidden)}/></div><br />
        <div>Fullscreen: <button className="fsBtn" onClick={fullScreenHandler}>{isFullScreen ? 'Exit' : 'Enter'}</button></div>
      </div>
    </>
  )

  return (
    <div className="container">
      <button
        className="sideBarToggleButton"
        onClick={() => setSideBarHidden(!sideBarHidden)}
        style={{ left: sideBarHidden ? '0' : `${Math.max(280, window.innerWidth * 0.135)}px`,}}
      >
        {sideBarHidden ? <SlArrowRight /> : <SlArrowLeft />}
      </button>

      <div className='sideBar' style={{ left: sideBarHidden ? `${Math.min(-350, window.innerWidth * -0.25)}px` : '0' }}>
        <>
          <div className='logoContainer' style={{width: '30%', float: 'left'}}>
            <a href='https:///sites.google.com/a/uw.edu/mro/' target='_blank'>
              <img src={logo} className='Logo' style={{height: '3.5rem', width: '3.5rem'}} alt='UW Manastash Ridge Observatory Logo'/>
            </a>
          </div>
          <div className='title' style={{width: '68%', float: 'right', fontWeight: 'bold', fontSize: '25px', marginTop: '3%', textAlign: 'left'}}>
            Manastash Ridge Observatory
          </div>
        </>
        <hr style={{width: '100%', marginTop: '100px'}}/>
        <div style={{height: '80%', fontWeight: 'bold', float: 'left', textAlign: 'left', padding: '20px 0 0 20px'}}>
          <h3>Controls</h3>
          {controls.map((tab) => (
            <div style={{margin: '10px 0', padding: '0 20px', display: 'flex', alignItems: 'center', fontSize: '0.9rem'}}>
              <div style={{ marginRight: '8px', alignItems: 'center', display: 'flex', fontSize: '25px' }}>{tab.icon}</div>
              <div className="link" onClick={() => {setActiveTab(tab.id)}} style={{color: activeTab == tab.id ? '#9100c3 ' : ''}}>{tab.label}</div>
            </div>
          ))}
          <h3 style={{ marginTop: '50px'}}>Links</h3>
          {miscLinks.map((tab) => (
            <div style={{margin: '10px 0', padding: '0 20px', display: 'flex', alignItems: 'center', fontSize: '0.9rem'}}>
              <div style={{ marginRight: '10px', alignItems: 'center', display: 'flex', fontSize: '25px' }}>{tab.icon}</div>
              <div><a className="link" href={tab.link} target="_blank">{tab.label}</a></div>
            </div>
          ))}
        </div>
      </div>
      {/* This is a dummy div for transition smoothness */}
      <div style={{width: sideBarHidden ? '0': '15%', transition: '0.5s'}}></div> 
      <div className='mainContainer' style={{width: sideBarHidden ? '99.5%' : '83%', textAlign: 'center', marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'width 0.3s ease'}}>
        {!infoBarHidden && 
        <div className='infoPanel' style={{ height: '20vh', width: '97.5%', backgroundColor: '#363636', borderRadius: '10px', marginTop: '10px'}}>
          <div>
            <span>Camera</span>
            <div class="infoBarGrid">
              <div><span>Temperature:</span> N/A</div>
              <div><span>Filter:</span>N/A</div>
              <div><span>Time left:</span>N/A</div>
              <div><span>Status:</span>N/A</div>
            </div>
          </div>
          <div>
            <span>Telescope</span>
            <div class="infoBarGrid">
              <div><span>RA:</span> N/A</div>
              <div><span>DEC:</span>N/A</div>
              <div><span>Target Object:</span>N/A</div>
              <div><span>Tracking Status:</span>N/A</div>
            </div>
          </div>
          <div>
            <span>Weather</span>
            <div>
              <Weather />
            </div>
          </div>
          <div className="logContainer">
            <p style={{color: 'red'}}>vv Dummy data vv</p>
            <p>[21/Dec/2024 03:34:15] "GET /getStatus HTTP/1.1" 200 - /getStatus HTTP/1.1" 200</p>
            <p>[21/Dec/2024 03:34:15] "GET /getStatus HTTP/1.1" 200 -</p>
            <p>[21/Dec/2024 03:34:15] "GET /getStatus HTTP/1.1" 200 -</p>
            <p>[21/Dec/2024 03:34:15] "GET /getStatus HTTP/1.1" 200 -</p>
            <p>[21/Dec/2024 03:34:15] "GET /getStatus HTTP/1.1" 200 -</p>
            <p>[21/Dec/2024 03:34:15] "GET /getStatus HTTP/1.1" 200 -</p>
            <p>[21/Dec/2024 03:34:15] "GET /getStatus HTTP/1.1" 200 -</p>
            <p>[21/Dec/2024 03:34:15] "GET /getStatus HTTP/1.1" 200 -</p>
            <p>[21/Dec/2024 03:34:15] "GET /getStatus HTTP/1.1" 200 -</p>
            <p>[21/Dec/2024 03:34:15] "GET /getStatus HTTP/1.1" 200 -</p>
            <p>[21/Dec/2024 03:34:15] "GET /getStatus HTTP/1.1" 200 -</p>
          </div>
        </div>}
        <div className='mainPanel' style={{ minHeight: infoBarHidden ? '97vh' : '75vh', width: '97.5%', backgroundColor: '#363636', borderRadius: '10px', marginTop: '20px', overflowY: 'auto', overflowX: 'hidden'}}>
          {/* Camera tab needs to persist so that JS9 has always a valid canvas to load in */}
          <div style={{ display: activeTab === 'camera' ? 'block' : 'none'}}>{cameraComponent}</div>
          {activeTab === 'framing_and_focus' && framingAndFocusComponent}
          {activeTab === 'telescope' && telescopeComponent}
          {activeTab === 'settings' && settingsComponent}
        </div>
      </div>
    </div>
  );
}

export default App;