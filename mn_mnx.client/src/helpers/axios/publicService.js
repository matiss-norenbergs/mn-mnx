import { reactRequest, respStatus } from "../reactRequest"
import { publicTypes, reactObject } from "../constants"

const loginUser = (postParams, signal) => {
    return reactRequest(reactObject.public, publicTypes.user, "login", postParams, signal)
}

const logoutUser = (signal) => {
    return reactRequest(reactObject.public, publicTypes.user, "logout", {}, signal)
}

const getUser = (signal) => {
    return reactRequest(reactObject.public, publicTypes.user, "get", {}, signal)
}

export {
    respStatus,

    loginUser,
    logoutUser,
    getUser
}