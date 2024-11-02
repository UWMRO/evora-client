/**
 * Displays options to select the type of image to expose.
 */
function ImageTypeSelector({imageType, setImageType, isDisabled}) {

    function GetImageTypeClicked(e) {
        setImageType(e.target.value)
    }
    
  return (
    <fieldset class="nice-fieldset" disabled={isDisabled}>
    <span><legend>Image Type</legend></span>
    <div class="radio-buttons">
        <label class="custom-radio">
            <input 
            type="radio" 
            name="ExpType" 
            onChange={GetImageTypeClicked}
            value="Bias"
            checked={
                imageType === 'Bias'
                } />
            <span>Bias</span>
        </label>
        <label class="custom-radio">
            <input type="radio" name="ExpType" onChange={GetImageTypeClicked} value="Flat"
            checked={imageType === 'Flat'} />
            <span>Flat</span>
        </label>
        <label class="custom-radio">
            <input type="radio" name="ExpType" onChange={GetImageTypeClicked} value="Dark"
            checked={imageType === 'Dark'} />
            <span>Dark</span>
        </label>
        <label class="custom-radio">
            <input type="radio" name="ExpType" onChange={GetImageTypeClicked} value="Object"
            checked={imageType === 'Object'} />
            <span>Object</span>
        </label>
    </div>
</fieldset>

  );
}



export default ImageTypeSelector;
