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
        if (msg === false) {
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
        <fieldset class="nice-fieldset">
        <span><legend>Startup</legend></span>
        <button disabled={initialized} onClick={onInitialize}>
            {initializing ? "Initializing ..." : "Initialize"}
        </button>
        <button disabled={!initialized} onClick={onShutdown}>
            {shuttingDown ? "Shutting Down ..." : "Shut Down"}
        </button>
        {failure && <p className="failure-message">Initialization failed (Is the server running?)</p>}
        <div className="loader-container">
            <BeatLoader
                color="red"
                size={12}
                loading={initializing || shuttingDown}
                speedMultiplier={0.7}
            />
        </div>
    </fieldset>
    
    )
}

export default OnOff;
