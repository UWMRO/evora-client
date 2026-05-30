import { getStatusTEC, getFilterWheel } from "../apiClient"

/**
 * Displays options to ping the server and the filter wheel server.
 */
function PingServer() {

    async function onPing() {
        console.log("Pinging Server")
        const msg = await getStatusTEC()
        console.log(msg)
    }

    async function fwOnPing() {
        console.log("Pinging Filter Wheel Connection")
        const msg = await getFilterWheel()
        console.log(msg.message)
    }

    return(
        <fieldset>
            <button onClick={onPing}>
                Ping Server
            </button>
            <button onClick={fwOnPing}>
                Ping Filter Wheel
            </button>
        </fieldset>
    )
}

export default PingServer
