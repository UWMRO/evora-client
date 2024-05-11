import { useState } from "react";
import { initialize, shutdown } from "../apiClient"
import BeatLoader from 'react-spinners/BeatLoader';

/**
 * Displays options ot initialize and shut down andor.
 */
function OnOff({initialized, setInitialized}) {

    const [shuttingDown, setShuttingDown] = useState(false);

    async function onInitialize() {
        console.log("Initializing Andor...")
        const msg = await initialize()
        console.log(msg)
        setInitialized(true)
    }

    async function onShutdown() {
        console.log("Shutting down Andor...")
        setShuttingDown(true)

        const msg = await shutdown()
        console.log(msg)
        setInitialized(false)
        setShuttingDown(false)
        // console.log("Pinging Filter Wheel Connection")
        // const msg = await getFilterWheelStatus()
        // console.log(msg.message)
    }

    return(
        <fieldset>
            <button disabled={initialized} onClick={onInitialize}>
                Initialize
            </button>
            <button disabled={!initialized} onClick={onShutdown}>
                { shuttingDown ? "Shutting Down ..." : "Shut Down" }
            </button>
            <label style={{ width: '200px' }}>
              <BeatLoader
                cssOverride={{ verticalAlign: 'bottom', alignContent: 'end' }}
                color="red"
                size={12}
                loading={shuttingDown}
                speedMultiplier={0.7}
              />
            </label>
        </fieldset>
    )
}

export default OnOff;
