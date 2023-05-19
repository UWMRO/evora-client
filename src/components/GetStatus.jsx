import { getStatus } from "../apiClient";

function GetStatus({currStatus, setCurrStatus}) {

    async function callGetStatus() {
      const status = JSON.parse(await getStatus());
      setCurrStatus(status["status"])
    }

    let statusMessage = "";
    if(currStatus != null){
      statusMessage = <span className='statusMessage'>Current Status: {currStatus}</span>
    }

    return (
      <fieldset className="Status">
        <label>Get Status</label>
        <button onClick={callGetStatus}>Get</button>
        {statusMessage}
      </fieldset>
    );
  }

  
  export default GetStatus;
  