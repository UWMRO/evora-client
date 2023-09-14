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
          <label> Single
              <input type='radio' name='ImageType' onChange={GetExposureTypeClicked} value='Single' 
              checked={
                exposureType === 'Single'
              }/>
          </label>
          <label> Real Time
              <input type='radio' name='ImageType' onChange={GetExposureTypeClicked} value='Real Time'
              checked={
                exposureType === 'Real Time'
              }/>
          </label>
          <label> Series
              <input type='radio' name='ImageType' onChange={GetExposureTypeClicked} value='Series'
              checked={
                exposureType === 'Series'
              }/>
          </label>
          
      </fieldset>
    );
  }
  
  
  
  export default ExposureTypeSelector;
  