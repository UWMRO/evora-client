import { capture } from "../apiClient"
import { useForm } from "react-hook-form"
import {useEffect, useState} from "react"



function ExposureControls({ exposureType, imageType, filterType }) {

    const [playing, setPlaying] = useState(false)
    const [audio] = useState(new Audio(process.env.PUBLIC_URL + '/tadaa-47995.mp3'))
    const [isExposing, setIsExposing] = useState(false)
    const [lastExpName, setLastExpName] = useState("")

    const {register, handleSubmit} = useForm()



    const onSubmit = async data => {
        // if exposure time is less than 0, set it to 0
        data.exptime = Math.max(0, data.exptime)
        // make sure exposure number is at least 1 exposure
        data.expnum = Math.max(1, data.expnum).toString()

        data.exptype = exposureType
        // if exposure time is 0, use bias type
        data.imgtype = data.exptime == 0 ? "Bias" : imageType
        data.exptime = data.exptime.toString()
        data.filtype = filterType

        setIsExposing(true)

        const message = await capture(JSON.stringify(data))

        setIsExposing(false)

        console.log(message)
        // need to create url for file
        window.JS9.Load(`${message.url}`)
        setLastExpName(message.url)

        // Play sounds after exposure completes.
        setPlaying(true)

    }

    useEffect(() => {
        playing ? audio.play() : audio.pause();
      },
      [playing, audio]
    );

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

            {/* <label> File Name
                <input type='text' {...register('filename', { required: false })} placeholder="image.fits"/>

            </label> */}

            {exposureType !== 'Real Time'
            && <label> Exposure Time
                <input type='number' {...register('exptime', { required: true })}/>
                </label>
            }

            {exposureType === 'Series'
            && <label> Number of Exposures
                <input type='number' {...register('expnum', { required: false })}/>
                </label>
            }

            {isExposing && <><div className='blink'>Exposing</div><br/></>}

            {(!isExposing && lastExpName !== "") &&
                <div>Last exposure: {lastExpName} &nbsp;
                    <a href={`http://127.0.0.1:8080${lastExpName}`}>Download</a>
                    <br/><br/>
                </div>
            }

            <button disabled={isExposing} type='submit'>Get Exposure</button>

        </form>
    );


  }

  export default ExposureControls;
