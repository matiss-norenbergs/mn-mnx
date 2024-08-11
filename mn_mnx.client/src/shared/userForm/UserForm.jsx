import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import { useDispatch } from "react-redux"

import Form from "@/components/form"
import Input from "@/components/input"
import Select from "@/components/select"
import DatePicker from "@/components/datePicker"

import TimeZoneSelect from "../timeZoneSelect"

import { parseDate } from "@internationalized/date"

import { getUserFormData, saveUserFormData, respStatus } from "@/helpers/axios/userService"
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
    key: "1",
    value: "User"
}, {
    key: "2",
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

    const axiosSignal = useRef(null)

    const isRegisterForm = formState === userFormStates.register
    const isEditForm = objectId !== "0"

    const getUser = useCallback((userId) => {
        if (formState === userFormStates.login)
            return

        if (userId !== "0")
            setModalTitle("Edit user")

        const postParams = {
            id: userId
        }

        getUserFormData(postParams, axiosSignal.current?.signal)
            .then(response => {
                if (!!response && response.status === respStatus.success) {
                    const {
                        name,
                        surname,
                        email,
                        password,
                        defaultTimeZone,
                        role,
                        birthday
                    } = response.data

                    form.setFieldsValue({
                        name,
                        surname,
                        email,
                        password,
                        password2: password,
                        defaultTimeZone,
                        role,
                        birthday: birthday ? parseDate(birthday) : undefined
                    })
                }
            })
    }, [form, setModalTitle, formState])

    const handleUserSave = useCallback(() => {
        return new Promise((resolve, reject) => {
            const postParams = {
                id: objectId
            }

            form.validateFields()
                .then(values => {
                    Object.keys(values).forEach(field => {
                        switch (field) {
                            case "birthday":
                                postParams[field] = values[field]?.toString() || ""
                                break
                            default:
                                postParams[field] = values[field]
                                break
                        }
                    })

                    saveUserFormData(postParams, axiosSignal.current?.signal)
                        .then(response => {
                            if (!!response && response.status === respStatus.success)
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

                    loginUser(postParams, axiosSignal.current?.signal)
                        .then(response => {
                            if (!!response && response.status === respStatus.success) {
                                dispatch(setUser(response.data))
                                navigate(0)
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
        axiosSignal.current = new AbortController()

        getUser(objectId)

        return () => {
            axiosSignal.current?.abort()
        }
    }, [getUser, objectId])

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
                        name="name"
                        initialValue=""
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
                <Input type="email" />
            </Form.Field>
            {isEditForm && (
                <>
                    <Form.Field
                        name="birthday"
                        initialValue={undefined}
                        label="Birthday"
                    >
                        <DatePicker />
                    </Form.Field>
                    <Form.Field
                        name="defaultTimeZone"
                        initialValue=""
                        label="Time zone"
                    >
                        <TimeZoneSelect />
                    </Form.Field>
                    <Form.Field
                        name="role"
                        initialValue={roleOptions[0].key}
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
                        <Input type="password" />
                    </Form.Field>
                    {isRegisterForm && (
                        <Form.Field
                            required
                            name="password2"
                            initialValue=""
                            rules={passwordRules}
                            label="Password (repeat)"
                        >
                            <Input type="password" />
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