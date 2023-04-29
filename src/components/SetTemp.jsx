import { useForm } from "react-hook-form"
import { setTemperature } from "../apiClient";

function SetTemp({temp, setTemp}) {

    const {register, handleSubmit} = useForm()

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
      <form onSubmit={handleSubmit(onSubmit)} className='Temperature'>
        <label>Set Temperature</label>
        <span className='tempCelsiusIcon'>
          <input type='text' {...register('temperature', { required: true })} maxlength='4' placeholder='-50'/>
        </span>
        <button type='submit'>Set</button>
        {coolingMessage}
      </form>
      
    );
  }

  
  export default SetTemp;
  