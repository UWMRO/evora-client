import { getStatusTEC, getFilterWheelStatus } from "../apiClient"

function PingServer() {

    async function onPing() {
        console.log("Pinging Server")
        const msg = await getStatusTEC()
        console.log(msg)
    }
    
    async function fwOnPing() {
        console.log("Pinging Filter Wheel Connection")
        const msg = await getFilterWheelStatus()
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