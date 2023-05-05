import { getTemperature } from "../apiClient";

function GetTemp({currTemp, setCurrTemp}) {

    async function callGetTemperature() {
      const temperature = JSON.parse(await getTemperature());
      // console.log(temperature);
      setCurrTemp(temperature["temperature"])
    }

    let tempMessage = "";
    if(currTemp != null){
      tempMessage = <span className='tempMessage'>Current temp: {currTemp} °C</span>
    }

    return (
      <fieldset className="Temperature">
        <label>Get Temperature</label>
        <button onClick={callGetTemperature}>Get</button>
        {tempMessage}
      </fieldset>
    );
  }

  
  export default GetTemp;
  