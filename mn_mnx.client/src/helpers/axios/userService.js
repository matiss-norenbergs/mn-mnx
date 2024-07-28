import axios from "axios"

import { apiUrl, objects } from "@/helpers/constants"

const respStatus = {
    success: 200
}

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

const getUserListData = async (cancelToken) => {
    return axios.get(`${apiUrl}${objects.user}`, {
        headers: headers
    }, {
        cancelToken: cancelToken
    })
}

const getUserData = (postParams, cancelToken) => {
    return axios.get(`${apiUrl}${objects.user}/${postParams?.id}`, {
        cancelToken: cancelToken
    })
}

const saveUserData = (postParams, cancelToken) => {
    return axios.post(`${apiUrl}${objects.user}`,
        postParams,
        {
            headers: headers
        },
        {
            cancelToken: cancelToken
        }
    )
}

const deleteUserData = (postParams, cancelToken) => {
    return axios.delete(`${apiUrl}${objects.user}/${postParams?.id}`, {
        cancelToken: cancelToken
    })
}

export {
    respStatus,
    getUserListData,
    getUserData,
    saveUserData,
    deleteUserData
}