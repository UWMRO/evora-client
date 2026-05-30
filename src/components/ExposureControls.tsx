import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { abort, capture } from '../apiClient';

/**
 * Fields for submitting exposure request including header comment, exposure time, number of exposures, and
 * extra displays for successful exposures.
 */
function ExposureControls({
  exposureType,
  imageType,
  filterType,
  setDisplayedImage,
  setDisableControls,
  isDisabled,
  currTimer,
  setCurrTimer,
}) {
  const [playing, setPlaying] = useState(false);
  const [audio] = useState(
    new Audio(import.meta.env.PUBLIC_URL + '/tadaa-47995.mp3')
  );
  const [isExposing, setIsExposing] = useState(false);
  const [lastExpName, setLastExpName] = useState('');
  const [exposureData, setExposureData] = useState(null);
  const [stopRealtime, setStopRealTime] = useState(false);

  const [capture_response, setCaptureResponse] = useState('');

  const [seriesExposures, setSeriesExposures] = useState([]);

  const { register, handleSubmit } = useForm();

  // For timer/loading bar
  const [time, setTime] = useState(undefined); // progress bar progress
  // const [currTimer, setCurrTimer] = useState(undefined);
  const [endTime, setEndTime] = useState(null); // Timer accuracy

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad the minutes and seconds with leading zeros if they are less than 10
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  const onSubmit = async (data) => {
    if (isExposing) return;
    setDisableControls(true);
    setExposureData(null);
    // if exposure time is less than 0, set it to 0
    if (exposureType === 'Real Time') {
      data.exposure_time = 1.0;
    } else if (imageType === 'Bias') {
      data.exposure_time = 0.0;
    } else {
      data.exposure_time = Math.max(0, parseFloat(data.exposure_time));
    }

    if (!data.n_frames) {
      data.n_frames = 1;
    }

    // make sure exposure number is at least 1 exposure
    data.n_frames = Math.max(1, parseFloat(data.n_frames));

    data.exposure_type =
      exposureType === 'Series' ? 'single' : exposureType.toLowerCase();
    // if exposure time is 0, use bias type
    data.image_type =
      data.exposure_time === 0 ? 'bias' : imageType.toLowerCase();
    data.exposure_time = parseFloat(data.exposure_time);
    data.filter = filterType;

    if (data.image_type !== 'bias' && data.exposure_type != 'real time') {
      setTime(data.exposure_time);
      setCurrTimer(data.exposure_time);
      setEndTime(Date.now() + data.exposure_time * 1000);
    }

    setIsExposing(true);

    const response = await capture(data);

    setIsExposing(false);

    if (!response.success) {
      setCaptureResponse('Exposure failed.');
      setLastExpName('');
      return;
    }

    // window.JS9.Load(message.url)
    setDisplayedImage((old) => {
      if (old === response.path) {
        window.JS9.RefreshImage();
      }
      return response.path;
    });
    setLastExpName(response.path);
    seriesExposures.push(response.path);

    // take another exposure for series
    if (exposureType === 'Series' && data.n_frames > 1) {
      data.n_frames--;
      setTimeout(() => onSubmit(data), 1000);
      return;
    }

    // Play sounds after exposure completes.
    if (!exposureType === 'Real Time') {
      setPlaying(true);
    }

    setDisableControls(false);
    setExposureData(data);
  };

  // Repeat exposures in Real Time until stopped
  useEffect(() => {
    if (exposureData == null) return;
    if (exposureData.exposure_type === 'real time' && !stopRealtime) {
      onSubmit(exposureData);
    }
  }, [exposureData]);

  // toggle audio playing
  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

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
      return (
        <>
          <div>{link}</div>
          <a href={link}>Download</a>
          <br />
          <br />
        </>
      );
    });
    return [...links];
  }

  /**
   * Abort the exporsure
   */
  async function abortExposure() {
    setCurrTimer(undefined);
    if (!isExposing) return;

    setStopRealTime(true);

    const response = await abort();

    setIsExposing(false);
    setDisableControls(false);

    setCaptureResponse(response.message);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='exposure-controls'>
      <fieldset disabled={isDisabled}>
        <legend>Exposure Controls</legend>

        {/* [OLD] File name field */}
        {/* <label> File Name
                <input type='text' {...register('filename', { required: false })} placeholder="image.fits"/>

            </label> */}

        {/* Header comment field */}
        <label>
          Header Comment
          <input
            className='headerCommentField'
            type='text'
            maxLength='70'
            {...register('comment', { required: false })}
          />
        </label>

        {/* Exposure Time */}
        {exposureType !== 'Real Time' && imageType !== 'Bias' && (
          <label>
            {' '}
            Exposure Time
            <input
              className='exposureNumberField'
              type='number'
              {...register('exposure_time', { required: true })}
              placeholder='seconds'
              min={0.01}
              max={3600}
              step={0.01}
            />
          </label>
        )}

        {/* Number of Exposures */}
        {exposureType === 'Series' && (
          <label>
            {' '}
            Number of Exposures
            <input
              className='exposureNumberField'
              type='number'
              {...register('n_frames', { required: false })}
              min={1}
            />
          </label>
        )}

        {/* Exposing Indicator */}
        {isExposing && (
          <>
            <div className='blink'>Exposing</div>
            <br />
          </>
        )}

        {/* fits file download text */}
        {!isExposing && lastExpName !== '' && exposureType !== 'Series' && (
          <div>
            Last exposure: {lastExpName} &nbsp;
            <a href={lastExpName}>Download</a>
            <br />
            <br />
          </div>
        )}

        {/* Download mutliple (Series) */}
        {exposureType === 'Series' && seriesExposures.length !== 0 && (
          <>
            <div>Series exposures:</div>
            <br />
          </>
        )}

        {exposureType === 'Series' &&
          seriesExposures.length !== 0 &&
          seriesLinks()}

        {/* Capture response */}
        {!isExposing && <p>{capture_response}</p>}

        {/* End exposure (for real time) */}
        {isExposing && exposureType === 'Real Time' && (
          <button onClick={() => setStopRealTime(true)}>End Exposure</button>
        )}

        {/* Show the timer and the progress bar */}
        {currTimer !== undefined && (
          <div>
            {formatTime(currTimer)}
            <div className='timerOutside'>
              {/* Key causes a rerender for series */}
              <div
                key={endTime}
                className='timerInside'
                style={{ animation: `smoothProgress ${time}s linear forwards` }}
              />
            </div>
          </div>
        )}

        {/* Get Exposure Button */}
        <button
          className='temp-set'
          disabled={isExposing}
          onClick={() => {
            setSeriesExposures([]);
            setStopRealTime(false);
          }}
          type='submit'
        >
          Get Exposure
        </button>
        {exposureType !== 'Real Time' && (
          <button
            className='temp-set'
            disabled={!isExposing}
            onClick={abortExposure}
          >
            Abort Exposure
          </button>
        )}
      </fieldset>
    </form>
  );
}

export default ExposureControls;
