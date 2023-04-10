import axios from "axios";

// Helt onödig. Det var useState som ställde till det. Ändra detta
export function useAxios() {
    return { callbackAxios };
}

function callbackAxios(method: string, url: string, data?: object) {
    const res = axios({
        method,
        url,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        data,
    })
        .then((res) => {
            console.log("res.data", res.data);
            return res.data;
        })
        .catch((error) => {
            console.log("error", error.response);
            return error.response;
        });

    return res;
}
