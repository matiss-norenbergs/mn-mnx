import axios from "axios"

import { apiUrl } from "./constants"

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data'
}

const respStatus = {
    success: 200
}

const reactRequest = (object, type, operation, postParams, signal, customConfig = {}) => {
    const formData = new FormData()

    Object.keys(postParams).forEach(key => {
        const value = postParams[key]
        if (value !== undefined)
            formData.append(key, value)
    })

    let query = `?type=${type}&operation=${operation}`
    if (customConfig.query)
        query = customConfig.query

    return axios.post(`${apiUrl}${object}${query}`,
        formData,
        {
            headers: headers,
            signal: signal
        }
    )
    .catch(() => {
        console.log("REACT REQUEST ERROR")
    })
}

export {
    respStatus,
    reactRequest
}