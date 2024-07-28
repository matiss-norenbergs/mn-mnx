import PropTypes from "prop-types"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import Form from "@/components/form"
import Input from "@/components/input"
import Select from "@/components/select"

import TimeZoneSelect from "../timeZoneSelect"

import { getUserData, saveUserData } from "@/helpers/axios/userService"
import { loginUser } from "@/helpers/axios/authService"
import { setUser } from "@/redux/features/user/userSlice"

//import styles from "./UserForm.module.css"

const userFormStates = {
    login: 1,
    register: 2
}

const propTypes = {
    objectId: PropTypes.string,
    setModalTitle: PropTypes.func,
    formState: PropTypes.oneOf(Object.values(userFormStates))
}
const defaultProps = {
    objectId: "0",
    formState: userFormStates.register
}

const inputRules = [
    { required: true, message: "This field is required!" },
    { whitespace: true, message: "This field is required!" }
]

const roleOptions = [{
    key: 1,
    value: "User"
}, {
    key: 2,
    value: "Admin"
}]

const UserForm = forwardRef(({
    objectId,
    setModalTitle,
    formState
}, ref) => {

    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const axiosCancelToken = useRef(null)

    const isRegisterForm = formState === userFormStates.register
    const isEditForm = objectId !== "0"

    const getUser = useCallback((userId) => {
        const postParams = {
            id: userId
        }

        getUserData(postParams, axiosCancelToken.current?.token)
            .then(response => {
                if (!!response && response.status === 200) {
                    const {
                        id,
                        name,
                        surname,
                        email,
                        password,
                        defaultTimeZone,
                        role
                    } = response.data

                    if (id !== "0")
                        setModalTitle("Edit user")

                    form.setFieldsValue({
                        name,
                        surname,
                        email,
                        password,
                        password2: password,
                        defaultTimeZone,
                        role
                    })
                }
            })
    }, [form, setModalTitle])

    const handleUserSave = useCallback(() => {
        return new Promise((resolve, reject) => {
            const postParams = {
                id: objectId
            }

            form.validateFields()
                .then(values => {
                    Object.keys(values).forEach(field => {
                        switch (field) {
                            case "role":
                                postParams[field] = Number(values[field])
                                break
                            default:
                                postParams[field] = values[field]
                                break
                        }
                    })

                    saveUserData(postParams, axiosCancelToken.current?.token)
                        .then(response => {
                            if (!!response && response.status === 200)
                                return resolve()
                        })
                        .catch(() => {
                            return reject()
                        })
                })
                .catch(() => {
                    return reject()
                })
        })
    }, [form, objectId])

    const handleUserLogin = useCallback(() => {
        return new Promise((resolve, reject) => {
            const postParams = {}

            form.validateFields()
                .then(values => {
                    Object.keys(values).forEach(field => {
                        if (["email", "password"].includes(field))
                            postParams[field] = values[field]
                    })

                    loginUser(postParams, axiosCancelToken.current?.token)
                        .then(response => {
                            if (!!response && response.status === 200) {
                                dispatch(setUser(response.data))
                                navigate("/")
                                return resolve()
                            }
                        })
                        .catch(() => {
                            return reject()
                        })
                })
                .catch(() => {
                    return reject()
                })
        })
    }, [form, dispatch, navigate])

    useImperativeHandle(ref, () => ({
        save: handleUserSave,
        login: handleUserLogin
    }), [handleUserSave, handleUserLogin])

    useEffect(() => {
        getUser(objectId)
    }, [getUser, objectId])

    useEffect(() => {
        axiosCancelToken.current = axios.CancelToken.source()

        return () => axiosCancelToken.current?.cancel
    }, [])

    const validatePassword = useCallback(({ field }, value) => {
        return new Promise((resolve, reject) => {
            if (!isRegisterForm)
                return resolve()

            const otherPassword = form.getFieldValue(field === "password" ? "password2" : "password")
            if (value !== otherPassword)
                return reject("Passwords don't match!")

            return resolve()
        })
    }, [form, isRegisterForm])

    const passwordRules = useMemo(() => {
        return [
            ...inputRules,
            { validator: validatePassword }
        ]
    }, [validatePassword])

    return (
        <Form form={form}>
            {isRegisterForm && (
                <>
                    <Form.Field
                        required
                        name="name"
                        initialValue=""
                        rules={inputRules}
                        label="Name"
                    >
                        <Input />
                    </Form.Field>
                    <Form.Field
                        required
                        name="surname"
                        initialValue=""
                        rules={inputRules}
                        label="Surname"
                    >
                        <Input />
                    </Form.Field>
                </>
            )}
            <Form.Field
                required
                name="email"
                initialValue=""
                rules={inputRules}
                label="Email"
            >
                <Input />
            </Form.Field>
            {isEditForm && (
                <>
                    <Form.Field
                        name="defaultTimeZone"
                        initialValue=""
                        //rules={inputRules}
                        label="Time zone"
                    >
                        <TimeZoneSelect />
                    </Form.Field>
                    <Form.Field
                        name="role"
                        initialValue={roleOptions[0].key}
                        //rules={inputRules}
                        label="Role"
                    >
                        <Select items={roleOptions} />
                    </Form.Field>
                </>
            )}
            {!isEditForm && (
                <>
                    <Form.Field
                        required
                        name="password"
                        initialValue=""
                        rules={passwordRules}
                        label="Password"
                    >
                        <Input password />
                    </Form.Field>
                    {isRegisterForm && (
                        <Form.Field
                            required
                            name="password2"
                            initialValue=""
                            rules={passwordRules}
                            label="Password (repeat)"
                        >
                            <Input password />
                        </Form.Field>
                    )}
                </>
            )}
        </Form>
    )
})
UserForm.propTypes = propTypes
UserForm.defaultProps = defaultProps

UserForm.displayName = 'UserForm'

export default UserForm