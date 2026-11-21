/**
 * Displays options to select the type of image to expose.
 */
function ImageTypeSelector({imageType, setImageType, isDisabled}) {

  function GetImageTypeClicked(e) {
      setImageType(e.target.value)
  }
    
  return (
    <fieldset disabled={isDisabled}> 
        <legend>
          Image Type
        </legend>
        <label className="custom-radio">
            <input type='radio' name='ExpType' onChange={GetImageTypeClicked} value='Bias'
            checked={
                imageType === 'Bias'
            }/>
            <span>Bias</span>
        </label>
        <label className="custom-radio">
            <input type='radio' name='ExpType' onChange={GetImageTypeClicked} value='Flat'
            checked={
                imageType === 'Flat'
            }/>
            <span>Flat</span>
        </label>
        <label className="custom-radio">
            <input type='radio' name='ExpType' onChange={GetImageTypeClicked} value='Dark'
            checked={
                imageType === 'Dark'
            }/>
            <span>Dark</span>
        </label>
        <label className="custom-radio">
            <input type='radio' name='ExpType' onChange={GetImageTypeClicked} value='Object'
            checked={
                imageType === 'Object'
            }/>
            <span>Object</span>
        </label>
    </fieldset>
  );
}

export default ImageTypeSelector;
