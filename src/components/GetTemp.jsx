import { getTemperature } from "../apiClient";

function GetTemp({currTemp, setCurrTemp, isDisabled}) {

    async function callGetTemperature() {
      const temperature = JSON.parse(await getTemperature());
      // Round the number
      var tempNum = parseFloat(temperature["temperature"]);
      var rounded = Math.round((tempNum + Number.EPSILON) * 100) / 100;

      setCurrTemp(rounded.toString())
    }

    let tempMessage = "";
    if(currTemp != null){
      tempMessage = <span className='tempMessage'>Current Temperature: {currTemp} °C</span>
    }

    return (
      <fieldset className="Temperature" disabled={isDisabled}>
        <label>Get Temperature</label>
        <button onClick={callGetTemperature}>Get</button>
        {tempMessage}
      </fieldset>
    );
  }

  
  export default GetTemp;
  