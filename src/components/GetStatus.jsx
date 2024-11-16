import { getStatus } from "../apiClient";
import { ERROR_CODES } from "./resources/andor_codes";

/**
 * Displays a button to display the current status of andor.
*/
function GetStatus({currStatus, setCurrStatus}) {

    async function callGetStatus() {
      const status = JSON.parse(await getStatus());
      setCurrStatus(status["status"])
    }

    let statusMessage = "";
    if(currStatus != null){
      statusMessage = <span className='statusMessage'>Current Status: {currStatus} ({ERROR_CODES[currStatus]})</span>
    }

    return (
      <fieldset>
        
        <button class = "stat_button" onClick={callGetStatus}>Get Status</button>
        {statusMessage}
      </fieldset>
    );
  }

  
  export default GetStatus;
  