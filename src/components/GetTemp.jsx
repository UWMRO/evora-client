import { useState, useEffect } from 'react';
import { getTemperature } from "../apiClient";

import { Line } from 'react-chartjs-2';
import "chart.js/auto";

/**
 * Displays a button to get and show the temperature of the camera
 */
function GetTemp({currTemp, setCurrTemp, isDisabled}) {


  let NUM_OF_DATA_POINTS = 20;

  let tempMessage = <span className='tempMessage'>Current Temperature: -999 °C</span>;

  const initialize_array = (num) => {
    let newArray = [];
    for(let i = 0; i < num; i++){
      newArray.push(0);
    }
    return newArray
  }

  const [dateArray, setDateArray] = useState(() => {
    const initialState = initialize_array(NUM_OF_DATA_POINTS);
    return initialState;
  });

  const [tempDataArray, setTempDataArray] = useState(() => {
    const initialState = initialize_array(NUM_OF_DATA_POINTS);
    return initialState;
  });

  const [buttonText, setButtonText] = useState('Details');
  const [graphDisplay, setGraphDisplay] = useState('none');
  const [graphDelay, setGraphDelay] = useState(30000);

  // get temperature loop
  useEffect(() => {
    if (graphDelay === -1) return;
    const interval = setInterval(() => {
      const temperaturePromise = getTemperature();
      temperaturePromise.then(val => {
        const temperature = JSON.parse(val);
        const tempNum = parseFloat(temperature["temperature"]);
        const rounded = Math.round((tempNum + Number.EPSILON) * 100) / 100;
        setCurrTemp(rounded.toString())

        setTempDataArray(tempDataArray => [...tempDataArray, tempNum])
        setDateArray(dateArray => [...dateArray, new Date().toTimeString().substring(3, 8)])
      })
      if(dateArray.length > NUM_OF_DATA_POINTS){
        setDateArray(dateArray.slice(1, NUM_OF_DATA_POINTS + 1))
      }
      if(tempDataArray.length > NUM_OF_DATA_POINTS){
        setTempDataArray(tempDataArray.slice(1, NUM_OF_DATA_POINTS + 1));
      }
    }, graphDelay);
    return () => clearInterval(interval);
  }, [dateArray, tempDataArray, setCurrTemp, graphDelay, NUM_OF_DATA_POINTS]);

  async function callGetTemperature() {
    const temperature = JSON.parse(await getTemperature());
    // Round the number
    const tempNum = parseFloat(temperature["temperature"]);
    const rounded = Math.round((tempNum + Number.EPSILON) * 100) / 100;

    setCurrTemp(rounded.toString())
  }

  if(currTemp != null){
    tempMessage = <span className='tempMessage'>Current Temperature: {currTemp} °C</span>
  }

  const data = {
    labels: dateArray,
    datasets: [
      {
        data: tempDataArray,
        borderColor: "#0ed100",
        tension: 0.1,
        backgroundColor: "white",
      },
    ],
  };

  const options = require("./resources/graph_options.json");
  

  const graphButtonHandler = () => {
    if(buttonText === 'Details'){
      setButtonText('Hide');
      setGraphDisplay('block');
    } else {
      setButtonText('Details');
      setGraphDisplay('none');
    }
  }

  return (
    <fieldset className="Temperature" disabled={isDisabled}>
      <label>Get Temperature</label>
      <button onClick={callGetTemperature}>Get</button>
      <button onClick={graphButtonHandler} style={{ width:'52px'}}>{buttonText}</button>
      {tempMessage}
      <div className="graphContainer" style={{ display: graphDisplay}}>
        Update Interval (Current: {graphDelay === -1 ? "Disabled" : graphDelay / 1000 + "s"}): <select name="delay" id="delay">
          <option value="1000">1s</option>
          <option value="3000">3s</option>
          <option value="5000">5s</option>
          <option value="10000">10s</option>
          <option value="15000">15s</option>
          <option selected="selected" value="30000">30s</option>
          <option value="-1">Disable</option>
        </select>
        <button onClick={function() {setGraphDelay(Number(document.getElementById("delay").value));}}>Set</button>
        <Line data={data} options={options}/>
      </div>
    </fieldset>
  );
}

export default GetTemp;
  