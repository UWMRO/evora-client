import { getStatus } from "../apiClient";

/**
 * Displays a button to display the current status of andor.
*/
function GetStatus({currStatus, setCurrStatus, isDisabled}) {

    async function callGetStatus() {
      const status = JSON.parse(await getStatus());
      setCurrStatus(status["status"])
    }

    let statusMessage = "";
    if(currStatus != null){
      statusMessage = <span className='statusMessage'>Current Status: {currStatus}</span>
    }

    return (
      <fieldset className="Status" disabled={isDisabled}>
        <label>Get Status</label>
        <button onClick={callGetStatus}>Get</button>
        {statusMessage}
      </fieldset>
    );
  }

  
  export default GetStatus;
  