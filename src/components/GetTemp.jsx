import { getTemperature } from "../apiClient";

function GetTemp({currTemp, setCurrTemp}) {

    async function callGetTemperature() {
      const temperature = JSON.parse(await getTemperature());
      // console.log(temperature);
      setCurrTemp(temperature["temperature"])
    }


    return (
      <fieldset className="Temperature">
        <label> Current Temperature {currTemp}
          <button onClick={callGetTemperature}>Get Temperature</button>
          
        </label>

      
      
            
      
      </fieldset>
    );
  }

  
  export default GetTemp;
  