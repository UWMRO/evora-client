import { useState } from "react";
import { initialize, shutdown } from "../apiClient"
import BeatLoader from 'react-spinners/BeatLoader';

/**
 * Displays options ot initialize and shut down andor.
 */
function OnOff({initialized, setInitialized}) {

    const [initializing, setInitializing] = useState(false);
    const [shuttingDown, setShuttingDown] = useState(false);
    const [failure, setFailure] = useState(false);

    async function onInitialize() {
        console.log("Initializing Andor...");
        setInitializing(true);

        const msg = await initialize();
        console.log(msg);
        if (msg.status !== -1) {
            console.log("Failed to initialize Andor.");
            setFailure(true);
        } else {
            setFailure(false);
            setInitialized(true);
        }
        setInitializing(false);
    }

    async function onShutdown() {
        console.log("Shutting down Andor...");
        setShuttingDown(true);

        const msg = await shutdown();
        console.log(msg);
        setInitialized(false);
        setShuttingDown(false);
    }

    return(
        <fieldset>
            <button disabled={initialized} onClick={onInitialize}>
                { initializing ? "Initializing ..." : "Initialize" }
            </button>
            <button disabled={!initialized} onClick={onShutdown}>
                { shuttingDown ? "Shutting Down ..." : "Shut Down" }
            </button>
            {failure && <p>Request failed (Is the server running?)</p>}
            <label style={{ width: '200px' }}>
              <BeatLoader
                cssOverride={{ verticalAlign: 'bottom', alignContent: 'end' }}
                color="red"
                size={12}
                loading={initializing || shuttingDown}
                speedMultiplier={0.7}
              />
            </label>
        </fieldset>
    )
}

export default OnOff;
