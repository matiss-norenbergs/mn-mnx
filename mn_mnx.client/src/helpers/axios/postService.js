import axios from "axios"

import { apiUrl, objects } from "@/helpers/constants"

const respStatus = {
    success: 200
}

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

const getPostListData = async (cancelToken) => {
    return axios.get(`${apiUrl}${objects.post}`, {
        headers: headers
    }, {
        cancelToken: cancelToken
    })
}

const getPostListPublicData = async (cancelToken) => {
    return axios.get(`${apiUrl}${objects.post}/public`, {
        headers: headers
    }, {
        cancelToken: cancelToken
    })
}

const savePostData = (postParams, cancelToken) => {
    return axios.post(`${apiUrl}${objects.post}`,
        postParams,
        {
            headers: headers
        },
        {
            cancelToken: cancelToken
        }
    )
}

const deletePostData = (postParams, cancelToken) => {
    return axios.delete(`${apiUrl}${objects.post}/${postParams?.id}`, {
        cancelToken: cancelToken
    })
}

export {
    respStatus,
    getPostListData,
    getPostListPublicData,
    savePostData,
    deletePostData
}