import { reactRequest, respStatus } from "../reactRequest"
import { reactObject, userTypes } from "../constants"

const getUserListData = (signal) => {
    return reactRequest(reactObject.user, userTypes.list, "get", {}, signal)
}

const deleteUserData = (postParams, signal) => {
    return reactRequest(reactObject.user, userTypes.list, "delete", postParams, signal)
}

const getUserFormData = (postParams, signal) => {
    return reactRequest(reactObject.user, userTypes.form, "get", postParams, signal)
}

const saveUserFormData = (postParams, signal) => {
    return reactRequest(reactObject.user, userTypes.form, "save", postParams, signal)
}

const getUserProfileSettingsData = (signal) => {
    return reactRequest(reactObject.user, userTypes.profileSettings, "get", {}, signal)
}

const saveUserProfileSettingsData = (postParams, signal) => {
    return reactRequest(reactObject.user, userTypes.profileSettings, "save", postParams, signal)
}

// Public
const getUserProfile = (postParams, signal) => {
    return reactRequest(`${reactObject.user}/profile`, null, null, postParams, signal, { query: `?operation=get` })
}

export {
    respStatus,

    getUserListData,
    deleteUserData,
    getUserFormData,
    saveUserFormData,

    getUserProfileSettingsData,
    saveUserProfileSettingsData,

    // Public
    getUserProfile
}