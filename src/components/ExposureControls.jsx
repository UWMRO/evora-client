import { capture, abort } from "../apiClient"
import { set, useForm } from "react-hook-form"
import {useEffect, useState, useRef} from "react"


/**
 * Fields for submitting exposure request including header comment, exposure time, number of exposures, and
 * extra displays for successful exposures.
 */
function ExposureControls({ exposureType, imageType, filterType, setDisplayedImage,
                            setDisableControls, isDisabled, currTimer, setCurrTimer }) {

    const [playing, setPlaying] = useState(false)
    const [audio] = useState(new Audio(process.env.PUBLIC_URL + '/tadaa-47995.mp3'))
    const [isExposing, setIsExposing] = useState(false)
    const [lastExpName, setLastExpName] = useState("")
    const [exposureData, setExposureData] = useState(null)
    const [stopRealtime, setStopRealTime] = useState(false)

    const [capture_response, setCaptureResponse] = useState("")

    const [seriesExposures, setSeriesExposures] = useState([])

    const {register, handleSubmit, getValues} = useForm()

    const [exposureQueue, setExposureQueue] = useState([]) //stores the exposure queue, which allows the observer to queue up several exposures.
    const shouldStopQueueRef = useRef(false) // ref to abort queue processing 

    // For timer/loading bar
    const [time, setTime] = useState(undefined);  // progress bar progress
    // const [currTimer, setCurrTimer] = useState(undefined);
    const [endTime, setEndTime] = useState(null);  // Timer accuracy

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        // Pad the minutes and seconds with leading zeros if they are less than 10
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    function addToExposureQueue(formData) { //allows an item to be added to exposureQueue
        // Apply same logic as onSubmit for exposure time
        let exptime;
        if (exposureType === "Real Time") {
            exptime = 1.0;
        } else if (imageType === "Bias") {
            exptime = 0.0;
        } else {
            exptime = Math.max(0, formData.exptime)
        }

        // Apply same logic as onSubmit for image type
        const imgtype = exptime === 0 ? "Bias" : imageType

        const queueItem = {
            comment: formData.comment,
            exptime: exptime,
            expnum: Math.max(1, formData.expnum || 1),
            exptype: exposureType === "Series" ? "Single" : exposureType,
            imgtype: imgtype,
            filtype: filterType
        }
        setExposureQueue(prev => [...exposureQueue, queueItem])
    }

    function clearExposureQueue() { // allows for the user to clear the Queue.
        setExposureQueue([])
    }

    async function submitQueuedExposures() {
        if (exposureQueue.length === 0 || isExposing) {
            return;
        }

        // Reset the stop flag at the start
        shouldStopQueueRef.current = false;

        const itemsToProcess = [...exposureQueue];

        for (let i = 0; i < itemsToProcess.length; i++) {
            if (shouldStopQueueRef.current) {
                setExposureQueue([]); 
                shouldStopQueueRef.current = false;
                return;
            }

            const queueItem = itemsToProcess[i];

            setExposureQueue(prev => prev.slice(1));

            const data = {
                comment: queueItem.comment,
                exptime: queueItem.exptime.toString(),
                expnum: queueItem.expnum.toString(),
                exptype: queueItem.exptype,
                imgtype: queueItem.imgtype,
                filtype: queueItem.filtype
            };

            await onSubmit(data);

            // Wait 1 second before next item
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        shouldStopQueueRef.current = false;
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

        if (data.imgtype !== "Bias" && data.exptype != "Real Time") {
            setTime(data.exptime);
            setCurrTimer(data.exptime);
            setEndTime(Date.now() + data.exptime * 1000);
        }

        setIsExposing(true)

        const message = await capture(JSON.stringify(data))

        setIsExposing(false)

        console.log(message)
        setCaptureResponse(message.message)

        if (message.status !== 0) {  // capture failed/aborted
            setLastExpName("");
            console.log(lastExpName);
            return;
        }
        // need to create url for file

        // window.JS9.Load(message.url)
        setDisplayedImage((old => {
            if (old === message.url) {
                window.JS9.RefreshImage()
            }
            return message.url
        }))
        setLastExpName(message.url)
        setSeriesExposures(prev => [...prev, message.url])

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

    useEffect(() => {
        let intervalId;

        if (currTimer !== undefined) {
            intervalId = setInterval(() => {
                // Need Date.now because setInterval can drift
                const timeLeftInSeconds = Math.round((endTime - Date.now()) / 1000);
                if (timeLeftInSeconds >= 0) {
                    setCurrTimer(timeLeftInSeconds);
                } else {
                    clearInterval(intervalId);
                    setCurrTimer(undefined); // Clear timer when it reaches zero
                }
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [endTime, currTimer]);



    function seriesLinks() {
        const links = seriesExposures.map((link) => {
                return (<><div>{link}</div><a href={link}>Download</a><br /><br /></>)
                }
            )
        return [...links]
    }

    /**
     * Abort the exposure and stop queue processing
     */
    async function abortExposure() {
        setCurrTimer(undefined);

        shouldStopQueueRef.current = true;

        if (!isExposing) return;

        setStopRealTime(true);

        const response = await abort();

        setIsExposing(false);
        setDisableControls(false);

        console.log(response);
        setCaptureResponse(response.message);
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
                <input className='headerCommentField' type='text' maxLength='70' {...register('comment', { required: false })}/>
            </label>

            {/* Exposure Time */}
            {((exposureType !== 'Real Time') && (imageType !== "Bias"))
            && <label> Exposure Time
                <input className='exposureNumberField' type='number' {...register('exptime', { required: true })} placeholder="seconds" min={0.01} max={3600} step={0.01} />
                </label>
            }

            {/* Number of Exposures */}
            {exposureType === 'Series'
            && <label> Number of Exposures
                <input className='exposureNumberField' type='number' {...register('expnum', { required: false })} min={1}/>
                </label>
            }

            {/* Exposing Indicator */}
            {isExposing && <><div className='blink'>Exposing</div><br/></>}

            {/* fits file download text */}
            {(!isExposing && lastExpName !== "" && exposureType !== "Series" && seriesExposures.length === 0) &&
                <div>Last exposure: {lastExpName} &nbsp;
                    <a href={lastExpName}>Download</a>
                    <br/><br/>
                </div>
            }

            {/* Download multiple (Series or Queue) */}
            {(seriesExposures.length !== 0) &&
                (<><div>{exposureType === "Series" ? "Series exposures:" : "Completed exposures:"}</div><br /></>)
            }

            {(seriesExposures.length !== 0) &&
                seriesLinks()
            }

            {/* Capture response */}
            {(!isExposing &&
                <p>{capture_response}</p>
            )}

            {/* End exposure (for real time) */}
            {(isExposing && exposureType === "Real Time" &&
                <button onClick={() => setStopRealTime(true)}>End Exposure</button>
            )}

            {/* Show the timer and the progress bar */}
            {currTimer !== undefined && (
                <div >
                    {formatTime(currTimer)}
                    <div className="timerOutside">
                        {/* Key causes a rerender for series */}
                        <div key={endTime} className="timerInside" style={{animation: `smoothProgress ${time}s linear forwards`}} />
                    </div>
                </div>
            )}

            {/* Get Exposure Button */}
            <button className="temp-set" disabled={isExposing} onClick={() => {setSeriesExposures([]); setStopRealTime(false)}} type='submit'>Get Exposure</button>
            {(exposureType !== "Real Time" && <button className="temp-set" disabled={!isExposing} onClick={abortExposure}>Abort Exposure</button>)}

            {/* Add to Exposure Queue button */}
            <button type="button" className="temp-set" disabled={isExposing} onClick={() => addToExposureQueue(getValues())}>Add to Queue</button>

            {/* Clear queue button */}
            {exposureQueue.length > 0 &&
            <button type="button" className="temp-set" disabled={isExposing} onClick={() => clearExposureQueue()}>Clear Queue</button>}

            {/* Send exporsure queue button */}
            {exposureQueue.length > 0 &&
            <button type="button" className="temp-set" disabled={isExposing} onClick={() => {setSeriesExposures([]); submitQueuedExposures()}}>Send Exposure Queue</button>}

            {/*Displays the queued exposures. */}
            {exposureQueue.length > 0 &&
                <ol style={{listStyleType: 'none'}}>
                    {exposureQueue.map(exposure => (
                        <li key={exposure.id} >
                            {exposure.comment + " " + exposure.exptime + " " + exposure.expnum + " " + exposure.exptype + " " + exposure.imgtype + " " + exposure.filtype} 
                        </li>
                    ))}
                </ol>
            }
            </fieldset>
        </form>
    );


  }

  export default ExposureControls;
