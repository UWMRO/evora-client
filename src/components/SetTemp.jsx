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
        // callSetTemperature(val)
        setTemp(await setTemperature(val))
        console.log('temperature set!')
      }
    }

    let coolingMessage = "";
    if(temp != null){
      coolingMessage = <span className='tempMessage'>Cooling to: {temp} °C</span>
    }

    return (
      <fieldset disabled={isDisabled} class="nice-fieldset"> 

  <form onSubmit={handleSubmit(onSubmit)} class="Temperature">
    <label><b>Set Temperature</b></label>
    <span className="tempCelsiusIcon">
      <input 
        type="text" 
        {...register("temperature", { required: true })} 
        maxLength="4" 
        placeholder="-50" 
        disabled={isDisabled}
      />
      
    </span>
    <button class = "setter" type="submit" disabled={isDisabled}>Set</button>
    {coolingMessage}
  </form>
</fieldset>

    );
  }

  
  export default SetTemp;
  