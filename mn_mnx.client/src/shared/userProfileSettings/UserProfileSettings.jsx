import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef
} from "react"

import Form from "@/components/form"
import Checkbox from "@/components/checkbox"

import { getUserProfileSettingsData, respStatus, saveUserProfileSettingsData } from "../../helpers/axios/userService"

const UserProfileSettings = forwardRef((_, ref) => {
    const [form] = Form.useForm()

    const axiosSignal = useRef(null)

    const getProfileSettings = useCallback(() => {
        getUserProfileSettingsData(axiosSignal.current?.signal)
            .then(response => {
                if (!!response && response.status === respStatus.success) {
                    const {
                        showFullName,
                        showEmail,
                        showBirthday
                    } = response.data

                    form.setFieldsValue({
                        showFullName,
                        showEmail,
                        showBirthday
                    })
                }
            })
    }, [form])

    const saveProfileSettings = useCallback(() => {
        return new Promise((resolve, reject) => {
            form.validateFields()
                .then(values => {
                    const postParams = {}

                    Object.keys(values).forEach(field => {
                        switch (field) {
                            default:
                                postParams[field] = values[field]
                                break
                        }
                    })

                    saveUserProfileSettingsData(postParams, axiosSignal.current?.signal)
                        .then(response => {
                            if (!!response && response.status === respStatus.success)
                                return resolve()
                        })
                        .finally(() => {
                            return reject()
                        })
                })
                .catch(() => {
                    return reject()
                })
        })
    }, [form])

    useImperativeHandle(ref, () => ({
        save: saveProfileSettings
    }), [saveProfileSettings])

    useEffect(() => {
        axiosSignal.current = new AbortController()

        getProfileSettings()

        return () => {
            axiosSignal.current?.abort()
        }
    }, [getProfileSettings])

    return (
        <Form form={form}>
            <Form.Field
                name="showFullName"
                initialValue={false}
                label="Show full name"
                valuePropName="checked"
            >
                <Checkbox />
            </Form.Field>
            <Form.Field
                name="showEmail"
                initialValue={false}
                label="Show email"
                valuePropName="checked"
            >
                <Checkbox />
            </Form.Field>
            <Form.Field
                name="showBirthday"
                initialValue={false}
                label="Show birthday"
                valuePropName="checked"
            >
                <Checkbox />
            </Form.Field>
        </Form>
    )
})
UserProfileSettings.displayName = "UserProfileSettings"

export default UserProfileSettings