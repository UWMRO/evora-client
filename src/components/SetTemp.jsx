import { useForm } from "react-hook-form"
import { setTemperature } from "../apiClient";

/**
 * Displays a field to input a set temperature to the camera.
 */
function SetTemp({temp, setTemp, isDisabled}) {

    const {register, handleSubmit} = useForm()

    // Remove this? "defined but never used"
    async function callSetTemperature(value) {
      console.log(value)
      setTemp(await setTemperature(value))
    }


    const onSubmit = async(data) => {
      const val = parseInt(data.temperature)
      if (isNaN(val)){
          console.log('Not A Number')
      } else {
        const response = await setTemperature(val);

        if (response === '-999') {  // -999 is an error code from the server
          console.log('Temperature out of range!');
          setTemp('Temperature out of range!');
          return;
        }

        setTemp(response);
        console.log('Temperature set!');
      }
    }

    let coolingMessage = "";
    if(temp != null){
      // display either temperature or error message
      coolingMessage = (!isNaN(parseInt(temp))) ? <span className='tempMessage'>Cooling to: {temp} °C</span> 
                                                : <span className='tempMessage'>{temp}</span>
    }

    return (
      <fieldset disabled={isDisabled}> 
        <legend>
        Temperature
        </legend>
      <form onSubmit={handleSubmit(onSubmit)} className='Temperature'>
        <label>Set Temperature</label>
        <span className='tempCelsiusIcon'>
          <input type='text' {...register('temperature', { required: true })} maxLength='4' placeholder='-50' disabled={isDisabled}/>
        </span>
        <button type='submit' disabled={isDisabled}>Set</button>
        {coolingMessage}
      </form>
      </fieldset>
    );
  }

  
  export default SetTemp;
  