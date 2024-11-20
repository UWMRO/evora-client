/**
 * Displays options to select the exposure type for the capture.
 */
function ExposureTypeSelector({exposureType, setExposureType, isDisabled}) {
    
    function GetExposureTypeClicked(e) {
        setExposureType(e.target.value)
    }

    return (
      <fieldset disabled={isDisabled}> 
          <legend>
              Exposure Type
          </legend>
          <label class = "custom-radio">
              <input type='radio' name='ImageType' onChange={GetExposureTypeClicked} value='Single' 
              checked={
                exposureType === 'Single'
              }/>
              <span>Single</span>
          </label>
          <label class = "custom-radio">
              <input type='radio' name='ImageType' onChange={GetExposureTypeClicked} value='Real Time'
              checked={
                exposureType === 'Real Time'
              }/>
              <span>Real Time</span>
          </label>
          <label class = "custom-radio">
              <input type='radio' name='ImageType' onChange={GetExposureTypeClicked} value='Series'
              checked={
                exposureType === 'Series'
              }/>
              <span>Series</span>
          </label>
          
      </fieldset>
    );
  }
  
  
  
  export default ExposureTypeSelector;
  