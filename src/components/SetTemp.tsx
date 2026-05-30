import { useForm } from 'react-hook-form';
import { setTemperature } from '../apiClient';

/**
 * Displays a field to input a set temperature to the camera.
 */
function SetTemp({ temp, setTemp, isDisabled }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const val = parseInt(data.temperature);
    if (isNaN(val)) {
      console.log('Not A Number');
    } else {
      const response = await setTemperature(val);

      if (!response) {
        setTemp('Failed setting temperature!');
        return;
      }

      setTemp(response['temperature']);
    }
  };

  let coolingMessage = '';
  if (temp != null) {
    // display either temperature or error message
    coolingMessage = !isNaN(parseInt(temp)) ? (
      <span className='tempMessage'>Cooling to: {temp} °C</span>
    ) : (
      <span className='tempMessage'>{temp}</span>
    );
  }

  return (
    <fieldset disabled={isDisabled}>
      <legend>Temperature</legend>
      <form onSubmit={handleSubmit(onSubmit)} className='Temperature'>
        <label>Set Temperature</label>
        <span className='tempCelsiusIcon'>
          <input
            className='tempInputField'
            type='number'
            {...register('temperature', { required: true })}
            maxLength='4'
            placeholder='-50'
            min={-120}
            max={-10}
            disabled={isDisabled}
          />
        </span>
        <button className='temp-set' type='submit' disabled={isDisabled}>
          Set
        </button>
        {coolingMessage}
      </form>
    </fieldset>
  );
}

export default SetTemp;
