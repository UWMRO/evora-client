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

    return (
      <form onSubmit={handleSubmit(onSubmit)} className='Temperature'>
        <label>Input Temperature (Celsius)
          <input type='text' {...register('temperature', { required: true })} placeholder='temperature (celsius)'/>
        </label>
        {temp}
        <input type='submit'/>
        
        
        
      </form>
      
            
      
      
    );
  }

  
  export default SetTemp;
  