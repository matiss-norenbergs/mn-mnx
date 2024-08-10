import { reactRequest, respStatus } from "../reactRequest"
import { postTypes, reactObject } from "../constants"

const getPostListData = (signal) => {
    return reactRequest(reactObject.post, postTypes.list, "get", {}, signal)
}

const deletePostData = (postParams, signal) => {
    return reactRequest(reactObject.post, postTypes.list, "delete", postParams, signal)
}

const getPostListPublicData = (signal) => {
    return reactRequest(`${reactObject.post}/public`, null, null, {}, signal, { query: `?operation=get` })
}

const getPostFormData = (postParams, signal) => {
    return reactRequest(reactObject.post, postTypes.form, "get", postParams, signal)
}

const savePostFormData = (postParams, signal) => {
    return reactRequest(reactObject.post, postTypes.form, "save", postParams, signal)
}

export {
    respStatus,
    getPostListData,
    deletePostData,
    getPostFormData,
    savePostFormData,

    getPostListPublicData,
}