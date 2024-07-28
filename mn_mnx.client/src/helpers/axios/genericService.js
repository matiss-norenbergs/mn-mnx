import axios from "axios"

import { apiUrl, objects } from "@/helpers/constants"

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

const getTimeZoneOptions = (cancelToken) => {
    return axios.get(`${apiUrl}${objects.generic}`, {
        headers: headers
    }, {
        cancelToken: cancelToken
    })
}

export {
    getTimeZoneOptions
}