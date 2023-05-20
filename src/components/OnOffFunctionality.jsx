import { initialize, shutdown } from "../apiClient"

function OnOff({initialized, setInitialized}) {

    async function onInitialize() {
        console.log("Initializing Andor...")
        const msg = await initialize()
        console.log(msg)
        setInitialized(true)
    }
    
    async function onShutdown() {
        console.log("Shutting down Andor...")
        const msg = await shutdown()
        console.log(msg)
        setInitialized(false)
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
                Shut Down
            </button>
        </fieldset>
    )
}

export default OnOff;