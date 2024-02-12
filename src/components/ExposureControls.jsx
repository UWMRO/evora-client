import { capture } from "../apiClient"
import { useForm } from "react-hook-form"
import {useEffect, useState} from "react"


/**
 * Fields for submitting exposure request including header comment, exposure time, number of exposures, and
 * extra displays for successful exposures.
 */
function ExposureControls({ exposureType, imageType, filterType, setDisplayedImage, setDisableControls, isDisabled}) {

    const [playing, setPlaying] = useState(false)
    const [audio] = useState(new Audio(process.env.PUBLIC_URL + '/tadaa-47995.mp3'))
    const [isExposing, setIsExposing] = useState(false)
    const [lastExpName, setLastExpName] = useState("")
    const [exposureData, setExposureData] = useState(null)
    const [stopRealtime, setStopRealTime] = useState(false)

    const [seriesExposures, setSeriesExposures] = useState([])

    const {register, handleSubmit} = useForm()

    // For time/loading bar
    const [time, setTime] = useState(undefined);
    const [currTimer, setCurrTimer] = useState(undefined);

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
      
        // Pad the minutes and seconds with leading zeros if they are less than 10
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
      
        return `${formattedMinutes}:${formattedSeconds}`;
    }



    const onSubmit = async data => {
        if (isExposing) return
        setDisableControls(true)
        setExposureData(null)
        // if exposure time is less than 0, set it to 0
        if (exposureType === "Real Time") {
            data.exptime = 1.0
        } else if(imageType === "Bias") {
            data.exptime = 0.0
        } else {
            data.exptime = Math.max(0, data.exptime)
        }

        // make sure exposure number is at least 1 exposure
        data.expnum = Math.max(1, data.expnum).toString()

        data.exptype = exposureType === "Series" ? "Single" : exposureType;
        // if exposure time is 0, use bias type
        data.imgtype = data.exptime === 0 ? "Bias" : imageType
        data.exptime = data.exptime.toString()
        data.filtype = filterType

        if (exposureType !== "Bias" && exposureType != "Real Time") {
            setTime(data.exptime);
            setCurrTimer(data.exptime);
        }

        setIsExposing(true)

        const message = await capture(JSON.stringify(data))

        setIsExposing(false)

        console.log(message)
        // need to create url for file

        // window.JS9.Load(message.url)
        setDisplayedImage((old => {
            if (old === message.url) {
                window.JS9.RefreshImage()
            }
            return message.url
        }))
        setLastExpName(message.url)
        seriesExposures.push(message.url)
        
        // take another exposure for series
        if (exposureType === "Series" && data.expnum > 1) {
            data.expnum--;
            setTimeout(() => onSubmit(data), 1000);
            return;
        }

        // Play sounds after exposure completes.
        if (!exposureType === "Real Time") {
            setPlaying(true)
        }

        setDisableControls(false)
        setExposureData(data)
    }

    // Repeat exposures in Real Time until stopped
    useEffect(() => {
        if (exposureData == null) return
        if (exposureData.exptype === "Real Time" && !stopRealtime)
        {
            onSubmit(exposureData);
        }
    }, [exposureData]
    )


    // toggle audio playing
    useEffect(() => {
        playing ? audio.play() : audio.pause();
      },
      [playing, audio]
    );

    // Listeners for audio
    useEffect(() => {
      audio.addEventListener('ended', () => setPlaying(false));
      return () => {
        audio.removeEventListener('ended', () => setPlaying(false));
      };
    }, [audio]);


    // For the timer countdown and the progress bar
    useEffect(() => {
        if (currTimer !== undefined && currTimer !== 0) {
          // Every 1000 milliseconds 
          const intervalId = setInterval(() => {
            setCurrTimer(currTimer => currTimer - 1);
          }, 1000);

          return () => clearInterval(intervalId);
        } else if (currTimer === 0) {
          // When timer hits 0, set to undefined to hide the bar and timer
          setTime(undefined);
          setCurrTimer(undefined);
        }
      }, [currTimer]);


    function seriesLinks() {
        const links = seriesExposures.map((link) => {
                return (<><div>{link}</div><a href={link}>Download</a><br /><br /></>)
                }
            )
        return [...links]
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='exposure-controls'>
            <fieldset disabled={isDisabled}>
            <legend>
                Exposure Controls
            </legend>

            {/* [OLD] File name field */}
            {/* <label> File Name
                <input type='text' {...register('filename', { required: false })} placeholder="image.fits"/>

            </label> */}

            {/* Header comment field */}
            <label>Header Comment
                <input type='text' {...register('comment', { required: false })}/>
            </label>

            {/* Exposure Time */}
            {((exposureType !== 'Real Time') && (imageType !== "Bias"))
            && <label> Exposure Time
                <input type='number' {...register('exptime', { required: true })}/>
                </label>
            }

            {/* Number of Exposures */}
            {exposureType === 'Series'
            && <label> Number of Exposures
                <input type='number' {...register('expnum', { required: false })}/>
                </label>
            }

            {/* Exposing Indicator */}
            {isExposing && <><div className='blink'>Exposing</div><br/></>}

            {/* fits file download text */}
            {(!isExposing && lastExpName !== "" && exposureType !== "Series") &&
                <div>Last exposure: {lastExpName} &nbsp;
                    <a href={lastExpName}>Download</a>
                    <br/><br/>
                </div>
            }

            {/* Download mutliple (Series) */}
            {(exposureType === "Series" && seriesExposures.length != 0) &&
                (<><div>Series exposures:</div><br /></>)
            }
        
            {(exposureType === "Series" && seriesExposures.length != 0) &&
                seriesLinks()
            }

            {/* End exposure (for real time) */}
            {(isExposing && exposureType === "Real Time" &&
                <button onClick={() => setStopRealTime(true)}>End Exposure</button>
            )}

            {/* Get Exposure Button */}
            {!isExposing && (<button disabled={isExposing} onClick={() => {setSeriesExposures([]); setStopRealTime(false)}} type='submit'>Get Exposure</button>)}

            {/* Show the timer and the progress bar */}
            {currTimer !== undefined && (
                <div >
                    {formatTime(currTimer)}
                    <div className="timerOutside">
                        <div className="timerInside" style={{animation: `smoothProgress ${time}s linear forwards`}} />
                    </div>
                </div>
            )}

            </fieldset>
        </form>
    );


  }

  export default ExposureControls;
