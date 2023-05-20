import { capture } from "../apiClient"
import { useForm } from "react-hook-form"
import {useEffect, useState} from "react"



function ExposureControls({ exposureType, imageType, filterType, setDisplayedImage, setDisableExpType}) {

    const [playing, setPlaying] = useState(false)
    const [audio] = useState(new Audio(process.env.PUBLIC_URL + '/tadaa-47995.mp3'))
    const [isExposing, setIsExposing] = useState(false)
    const [lastExpName, setLastExpName] = useState("")
    const [exposureData, setExposureData] = useState(null)
    const [stopRealtime, setStopRealTime] = useState(false)

    const {register, handleSubmit} = useForm()



    const onSubmit = async data => {
        if (isExposing) return
        setDisableExpType(true)
        setExposureData(null)
        // if exposure time is less than 0, set it to 0
        data.exptime = exposureType === "Real Time" ? 0.3 : Math.max(0, data.exptime)
        // make sure exposure number is at least 1 exposure
        data.expnum = Math.max(1, data.expnum).toString()

        data.exptype = exposureType
        // if exposure time is 0, use bias type
        data.imgtype = data.exptime === 0 ? "Bias" : imageType
        data.exptime = data.exptime.toString()
        data.filtype = filterType

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

        // Play sounds after exposure completes.
        if (!exposureType === "Real Time") {
            setPlaying(true)
        }

        setDisableExpType(false)
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='exposure-controls'>

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
            {(!isExposing && lastExpName !== "") &&
                <div>Last exposure: {lastExpName} &nbsp;
                    <a href={lastExpName}>Download</a>
                    <br/><br/>
                </div>
            }

            {/* End exposure (for real time) */}
            {(isExposing && exposureType === "Real Time" &&
                <button onClick={() => setStopRealTime(true)}>End Exposure</button>
            )}

            {/* Get Exposure Button */}
            <button disabled={isExposing} onClick={() => setStopRealTime(false)} type='submit'>Get Exposure</button>

        </form>
    );


  }

  export default ExposureControls;
