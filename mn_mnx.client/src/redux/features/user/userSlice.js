import { createSlice } from "@reduxjs/toolkit"

const initialState = {}

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state = Object.assign(state, action.payload)
        },
        removeUser: () => {
            return initialState
        }
    }
})

export const {
    setUser,
    removeUser
} = userSlice.actions

export default userSlice.reducer