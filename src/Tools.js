import { getStatus } from "./apiClient";
export async function callGetStatus() {
    const status = JSON.parse(await getStatus());
    return status["status"]
}

