import axios from "axios"

import { apiUrl, objects } from "@/helpers/constants"

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

const loginUser = (postParams, cancelToken) => {
    return axios.post(`${apiUrl}${objects.auth}/login`,
        postParams,
        {
            headers: headers
        },
        {
            cancelToken: cancelToken
        }
    )
}

const logoutUser = (cancelToken) => {
    return axios.post(`${apiUrl}${objects.auth}/logout`,
        {},
        {
            headers: headers
        },
        {
            cancelToken: cancelToken
        }
    )
}

const updateUserData = (cancelToken) => {
    return axios.post(`${apiUrl}${objects.auth}/update`,
        {},
        {
            headers: headers
        },
        {
            cancelToken: cancelToken
        }
    )
}

export {
    loginUser,
    logoutUser,
    updateUserData
}